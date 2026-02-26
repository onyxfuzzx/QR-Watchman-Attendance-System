import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-backend-webgl';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-attendance',
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements AfterViewInit, OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  latitude!: number;
  longitude!: number;

  detector!: faceDetection.FaceDetector;
  faceDetected = false;

  loading = false;
  success = false;
  message = '';

  private stream!: MediaStream;
  private detectInterval: any;

  constructor(private api: ApiService, private router: Router) { }

  // ================= INIT =================
  async ngAfterViewInit() {

    // 🔒 GUARD: must come FIRST
    const locationId = localStorage.getItem('locationId');

    if (!locationId) {
      this.router.navigate(['/watchman/dashboard']);
      return;
    }

    this.getLocation();
    await this.loadFaceModel();
    await this.startCamera();
    this.startFaceDetectionLoop();
  }

  ngOnDestroy() {
    this.stopCamera();
    clearInterval(this.detectInterval);
  }

  // ================= FACE MODEL =================
  async loadFaceModel() {
    this.detector = await faceDetection.createDetector(
      faceDetection.SupportedModels.MediaPipeFaceDetector,
      {
        runtime: 'tfjs',
        maxFaces: 1
      }
    );
  }

  // ================= FACE LOOP =================
  startFaceDetectionLoop() {
    this.detectInterval = setInterval(async () => {
      if (!this.video?.nativeElement || !this.detector) return;

      const faces = await this.detector.estimateFaces(
        this.video.nativeElement,
        { flipHorizontal: false }
      );

      this.faceDetected = faces.length > 0;
    }, 500); // every 0.5 sec
  }

  // ================= CAMERA =================
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      const video = this.video.nativeElement;
      video.srcObject = this.stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
    } catch (err) {
      console.error(err);
      this.message = 'Camera access denied';
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }
  }

  // ================= LOCATION =================
  getLocation() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
      },
      () => {
        this.message = 'Location access denied';
      }
    );
  }

  // ================= SUBMIT =================
  captureAndSubmit() {
    if (!this.faceDetected) {
      this.message = 'Face not detected. Please align your face.';
      return;
    }

    if (this.latitude == null || this.longitude == null) {
      this.message = 'Location not available';
      return;
    }


    const locationId = localStorage.getItem('locationId');
    if (!locationId) {
      this.message = 'QR expired or invalid. Please scan again.';
      return;
    }

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('Photo', blob);
      formData.append('Latitude', this.latitude.toString());
      formData.append('Longitude', this.longitude.toString());
      formData.append('LocationId', locationId);

      this.loading = true;

      this.api.markAttendance(formData).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.message = 'Attendance marked successfully';

          localStorage.removeItem('locationId'); // ✅ clear after use
          clearInterval(this.detectInterval);
          this.stopCamera();

          setTimeout(() => {
            this.router.navigate(['/watchman/dashboard']);
          }, 1200);
        },
        error: err => {
          this.loading = false;

          if (typeof err?.error === 'string') {
            this.message = err.error;
          } else if (err?.error?.errors) {
            // ASP.NET validation errors
            const firstKey = Object.keys(err.error.errors)[0];
            this.message = err.error.errors[firstKey][0];
          } else {
            this.message = 'Attendance failed';
          }
        }
      });

    }, 'image/jpeg', 0.9);
  }
}
