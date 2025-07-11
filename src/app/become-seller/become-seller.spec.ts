import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeSeller } from './become-seller';

describe('BecomeSeller', () => {
  let component: BecomeSeller;
  let fixture: ComponentFixture<BecomeSeller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeSeller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeSeller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
