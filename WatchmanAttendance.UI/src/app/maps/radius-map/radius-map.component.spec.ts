import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusMapComponent } from './radius-map.component';

describe('RadiusMapComponent', () => {
  let component: RadiusMapComponent;
  let fixture: ComponentFixture<RadiusMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiusMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiusMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
