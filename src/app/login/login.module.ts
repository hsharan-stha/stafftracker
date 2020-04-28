import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedButtonModule } from '@shared/shared-button/shared-button.module';
import { RegisterComponent } from './register/register.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ActivationCodeComponent } from './activation-code/activation-code.component';
import { AccountInfoComponent } from './account-setup/account-info/account-info.component';
import { CompanyInfoComponent } from './account-setup/company-info/company-info.component';
import { ScheduleComponent } from './account-setup/schedule/schedule.component';

import { GeozoneInfoComponent } from './account-setup/geozone-info/geozone-info.component';
import { PickTimeModule } from '@shared/pick-time/pick-time.module';
import { CheckboxModule } from '@shared/checkbox/checkbox.module';

import { UnifunTooltipsModule } from '@shared/unifun-tooltips/unifun-tooltips.module';
import { SharedModule } from '@shared/share.module';
import { ImageUploadModule } from '@shared/image-upload/image-upload.module';
import { ColorPickerModule } from '@shared/color-picker/color-picker.module';
import { MapModule } from '@shared/map/map.module';
import { TextMaskModule } from 'angular2-text-mask';

import { InvalidMessageModule } from '@shared/form-message/invalid-message.module';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';



@NgModule({
    declarations: [LoginComponent, RegisterComponent, LoginLayoutComponent, ActivationCodeComponent, AccountInfoComponent, CompanyInfoComponent, ScheduleComponent, GeozoneInfoComponent, AccountSetupComponent, LanguageSelectorComponent],
    imports: [
        CommonModule,
        LoginRoutingModule,
        SharedModule,
        SharedButtonModule,
        NgbModule,
        PickTimeModule,
        CheckboxModule,
        UnifunTooltipsModule,
        ImageUploadModule,
        ColorPickerModule,
        TextMaskModule,
        MapModule,
        InvalidMessageModule
    ],


})
export class LoginModule { }
