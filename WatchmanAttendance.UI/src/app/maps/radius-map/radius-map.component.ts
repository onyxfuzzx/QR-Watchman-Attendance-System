

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const google: any;

@Component({
  standalone: true,
  selector: 'app-radius-map',
  templateUrl: './radius-map.component.html',
  styleUrls: ['./radius-map.component.css']
})
export class RadiusMapComponent implements OnInit {

  lat!: number;
  lng!: number;
  radius = 50;

  map!: any;
  marker!: any;
  circle!: any;

  showRadius = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.lat = Number(this.route.snapshot.queryParamMap.get('lat'));
    this.lng = Number(this.route.snapshot.queryParamMap.get('lng'));
    this.radius = Number(this.route.snapshot.queryParamMap.get('radius')) || 50;

    if (!this.lat || !this.lng) {
      alert('Invalid location data');
      return;
    }

    setTimeout(() => this.initMap(), 300);
  }

  initMap(): void {
    const center = { lat: this.lat, lng: this.lng };

    this.map = new google.maps.Map(
      document.getElementById('map'),
      {
        center,
        zoom: this.getZoomLevel(),
        mapTypeId: 'roadmap',
        styles: this.darkMapStyle()
      }
    );

    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: 'Attendance Location'
    });

    this.circle = new google.maps.Circle({
      map: this.map,
      center,
      radius: this.radius,
      strokeColor: '#10b981',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#10b981',
      fillOpacity: 0.25
    });

    this.map.fitBounds(this.circle.getBounds());
  }

  toggleRadius(): void {
    this.showRadius = !this.showRadius;
    this.circle.setMap(this.showRadius ? this.map : null);
  }

  recenter(): void {
    const center = { lat: this.lat, lng: this.lng };
    this.map.setCenter(center);
    this.map.setZoom(this.getZoomLevel());
  }

  getZoomLevel(): number {
    if (this.radius <= 30) return 19;
    if (this.radius <= 80) return 18;
    if (this.radius <= 150) return 17;
    if (this.radius <= 300) return 16;
    return 15;
  }

  darkMapStyle() {
    return [
      { elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1f2937' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#374151' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#111827' }]
      }
    ];
  }
}




