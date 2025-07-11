import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProduct } from './upload-product';

describe('UploadProduct', () => {
  let component: UploadProduct;
  let fixture: ComponentFixture<UploadProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
