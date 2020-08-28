declare var $: any; //delete
declare var OrcidCookie: any;
declare var orcidVar: any;
declare var orcidGA: any;
declare var getBaseUri: any;
declare var orcidGA: any;
declare var orcidVar: any;

import { NgForOf, NgIf } 
    from '@angular/common'; 

import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, NgZone, Inject, ElementRef  } 
    from '@angular/core';

import { ReCaptchaComponent } 
    from 'angular2-recaptcha';

import { Observable, Subject, Subscription } 
    from 'rxjs';
import { takeUntil } 
    from 'rxjs/operators';

import { CommonNg2Module }
    from './../common/common';

import { CommonService } 
    from '../../shared/common.service';

import { FeaturesService }
    from '../../shared/features.service'

import { ModalService } 
    from '../../shared/modal.service'; 

import { OauthService } 
    from '../../shared/oauth.service';

import { SearchService } 
    from '../../shared/search.service';
    
import { GenericService }
    from '../../shared/generic.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IsThisYouComponent } from '@bit/orcid.angular.is-this-you';

import { PlatformInfoService } from '@bit/orcid.angular.platform-info';

@Component({
    selector: 'oauth-authorization-ng2',
    template:  scriptTmpl("oauth-authorization-ng2-template")
})
export class OauthAuthorizationComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(ReCaptchaComponent, {static: false}) captcha: ReCaptchaComponent;

    @ViewChild("titleLabel", {static: false}) titleLabel: ElementRef;
    @ViewChild("bodyLabel", {static: false}) bodyLabel: ElementRef;
    @ViewChild("contactLabel", {static: false}) contactLabel: ElementRef;
    @ViewChild("firstNameLabel", {static: false}) firstNameLabel: ElementRef;
    @ViewChild("lastNameLabel", {static: false}) lastNameLabel: ElementRef;
    @ViewChild("affiliationsLabel", {static: false}) affiliationsLabel: ElementRef;
    @ViewChild("dateCreatedLabel", {static: false}) dateCreatedLabel: ElementRef;
    @ViewChild("viewRecordLabel", {static: false}) viewRecordLabel: ElementRef;
    @ViewChild("signinLabel", {static: false}) signinLabel: ElementRef;
    @ViewChild("continueLabel", {static: false}) continueLabel: ElementRef;

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private subscription: Subscription;
    private userInfo: any;

    public newInput = new EventEmitter<boolean>();

    res: any;

    MAX_EMAIL_COUNT: number = 30;

    allowEmailAccess: any;
    alreadyClaimed: boolean;
    authorizationForm: any;
    counter: any;
    currentLanguage: any;
    duplicates: any;
    gaString: any;
    focusIndex: any;
    enablePersistentToken: any;
    errorEmail: any;
    errorEmailsAdditional: any;
    isLinkRequest: boolean;
    isOrcidPresent: any;
    invalidClaimUrl: boolean;
    linkType: any;
    oauthRequest: any;
    personalLogin: any;
    recaptchaWidgetId: any;
    recatchaResponse: any;
    requestInfoForm: any;
    registrationForm: any;
    scriptsInjected: any;
    site_key: any;
    showBulletIcon: any;
    showClientDescription: any;
    showDeactivatedError: any;
    showDuplicateEmailError: any;
    showEmailsAdditionalDeactivatedError: any;
    showEmailsAdditionalDuplicateEmailError: any;
    showEmailsAdditionalReactivationSent: any;
    showGeneralRegistrationError: any;
    showLimitedIcon: any;
    showLongDescription: any;
    showReactivationSent: any;
    showRecaptcha: any
    showRegisterForm: any;
    showRegisterProcessing: any;
    showUpdateIcon: any;
    showNotYouDescription: any;
    socialSignInForm: any;
    loadTime: any;
    generalRegistrationError: any;
    //registration form togglz features    
    disableRecaptchaFeatureEnabled: boolean = this.featuresService.isFeatureEnabled('DISABLE_RECAPTCHA');
    togglzReLoginAlert: boolean = this.featuresService.isFeatureEnabled('RE_LOGGIN_ALERT');    
    initReactivationRequest: any;
    nameFormUrl: string;
    realLoggedInUserName: string;
    effectiveLoggedInUserName: string;
    isLoggedIn: boolean;    
    assetsPath: String;
    aboutUri: String;
    shibbolethEnabled: boolean = false;
    theFormWasSubmittedAndHasSomeErrors = false
    isMobileView = false
    
    constructor(
        private zone:NgZone,
        private cdr:ChangeDetectorRef,
        private commonSrvc: CommonService,
        private featuresService: FeaturesService,
        private modalService: ModalService,
        private oauthService: OauthService,
        private searchSrvc: SearchService,
        private nameService: GenericService,
        public dialog: MatDialog,
        public _platformInfo: PlatformInfoService
    ) {
        window['angularComponentReference'] = {
            zone: this.zone,
            showDeactivationError: () => this.showDeactivationError(),
            component: this,
        };

        this.allowEmailAccess = true;
        this.authorizationForm = {
            userName: {
                value: ""
            }
        };
        this.alreadyClaimed = false;
        this.counter = 0;
        this.currentLanguage = OrcidCookie.getCookie('locale_v3');
        this.gaString = null;
        this.enablePersistentToken = true;
        this.errorEmail = null;
        this.errorEmailsAdditional = [];
        this.focusIndex = null;
        this.invalidClaimUrl = false;
        this.isLinkRequest = false;
        this.isOrcidPresent = false;
        this.linkType = "";
        this.site_key = orcidVar.recaptchaKey;
        this.oauthRequest = false;
        this.personalLogin = true;
        this.recaptchaWidgetId = null;
        this.recatchaResponse = null;
        this.requestInfoForm = null;    
        this.registrationForm = {};
        this.scriptsInjected = false;
        this.showNotYouDescription = false;
        this.showBulletIcon = false;
        this.showClientDescription = false;
        this.showDeactivatedError = false;
        this.showDuplicateEmailError = false;
        this.showEmailsAdditionalDeactivatedError = [false];
        this.showEmailsAdditionalDuplicateEmailError = [false];
        this.showEmailsAdditionalReactivationSent = [false];
        this.showGeneralRegistrationError = false
        this.showLimitedIcon = false;    
        this.showLongDescription = {};
        this.showRecaptcha = true;
        this.showReactivationSent = false;
        this.showRegisterForm = false;
        this.showRegisterProcessing = false;
        this.showUpdateIcon = false;
        this.socialSignInForm = {};
        this.loadTime = 0;
        this.generalRegistrationError = null;
        this.initReactivationRequest = { "email": null, "error": null, "success": false };
        this.nameFormUrl = '/account/names/public';
        this.isLoggedIn = false;
        this.commonSrvc.configInfo$
        .subscribe(
            data => {
                this.assetsPath = data.messages['STATIC_PATH'];
                this.shibbolethEnabled = data.messages['SHIBBOLETH_ENABLED'];
                this.aboutUri = data.messages['ABOUT_URI'];
                this.site_key = data.messages['RECAPTCHA_WEB_KEY'];
            },
            error => {
                console.log('oauthAuthorization.component.ts: unable to fetch configInfo', error);                
            } 
        );

        this.userInfo = this.commonSrvc.userInfo$
          .subscribe(
              data => {
                  this.userInfo = data;           
              },
              error => {
                  this.userInfo = {};
              } 
          );

        _platformInfo.get().subscribe(platformInfo => {
            this.isMobileView = platformInfo.tabletOrHandset
        })
        
    }

    addScript(url, onLoadFunction): void {      
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.src = this.assetsPath + url;
        script.onload = onLoadFunction;
        head.appendChild(script); // Inject the script
    }; 

    authorize($event): void {
        this.authorizationForm.approved = true;
        this.authorizeRequest();
        $event.preventDefault()
    };

    deny($event): void {
        this.authorizationForm.approved = false;
        orcidGA.gaPush(['send', 'event', 'Disengagement', 'Authorize_Deny', 'OAuth ' + this.gaString]);
        this.authorizeRequest();
        $event.preventDefault()
    };

    isValidClass(cur): any {
        var valid;
        if (cur === undefined) {
            return '';
        } 
        valid = true;
        if (cur.required && (cur.value == null || cur.value.trim() == '')) {
            valid = false;
        }
        if (cur.errors !== undefined && cur.errors.length > 0) {
            valid = false;
        }
        return valid ? '' : 'text-error';
    };

    showDeactivationError(): void {
        this.showDeactivatedError = true;
        this.showReactivationSent = false;        
        if(this.authorizationForm.userName.value != null && this.authorizationForm.userName.value.includes('@')) {
            this.initReactivationRequest.email = this.authorizationForm.userName.value;            
        } else {
            this.initReactivationRequest.email = '';
        }
    };

    showInstitutionLogin($event): void  {
        $event.preventDefault()
        this.personalLogin = false; // Hide Personal Login
        
        if(!this.scriptsInjected){ // If shibboleth scripts haven't been
                                        // loaded yet.

            let scriptInjectedCallback = function () {
                    this.scriptsInjected = true;
                };

            this.addScript('/javascript/shibboleth-embedded-ds/1.1.0/idpselect_config.js', this.addScript.bind(this, '/javascript/shibboleth-embedded-ds/1.1.0/idpselect.js', scriptInjectedCallback.bind(this)));
        };
    };


    showPersonalLogin($event): void {        
        this.personalLogin = true;
        $event.preventDefault()
    };

    switchForm($event, email): void {
        $event.stopPropagation()
        $event.preventDefault()
        this.showDeactivatedError = false;
        this.showReactivationSent = false; 
        var re = new RegExp("(/register)(.*)?$");
        if (this.registrationForm.linkType=="social") {
            window.location.href = getBaseUri() + "/social/access";
        } else if (this.registrationForm.linkType=="shibboleth") {
            window.location.href = getBaseUri() + "/shibboleth/signin";
        } else if(re.test(window.location.pathname)){
            window.location.href = getBaseUri() + "/signin?loginId=" + email;
        } else {
            this.authorizationForm.userName.value = email;
            this.showRegisterForm = !this.showRegisterForm;
            if (!this.personalLogin) {
                this.personalLogin = true;
            }
        }
        this.cdr.detectChanges();
        
    };

    toggleNotYouDescription(): void {
        this.showNotYouDescription = !this.showNotYouDescription;
    };

    toggleClientDescription(): void {
        this.showClientDescription = !this.showClientDescription;
    };

    toggleLongDescription(orcid_scope): void {              
        this.showLongDescription[orcid_scope] = !this.showLongDescription[orcid_scope];
    };

    updateActivitiesVisibilityDefault(priv, $event): void {
        this.registrationForm.activitiesVisibilityDefault.visibility = priv;
    };

    addEmailField(): void {
        this.registrationForm.emailsAdditional.push({value: ''});
        this.cdr.detectChanges();       
        this.newInput.emit(true); 
    };  

    removeEmailField(index): void {
        this.registrationForm.emailsAdditional.splice(index, 1);
        this.cdr.detectChanges();
    };

    authorizeRequest(): void {
        let auth_scope_prefix = null;
        let is_authorize = null;

        auth_scope_prefix = 'Authorize_';
        if(this.enablePersistentToken) {
            this.authorizationForm.persistentTokenEnabled=true;
            auth_scope_prefix = 'AuthorizeP_';
        }
        if(this.allowEmailAccess) {
            this.authorizationForm.emailAccessAllowed = true;
        }
        is_authorize = this.authorizationForm.approved;

        this.oauthService.authorizeRequest( this.authorizationForm )
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                if(is_authorize) {
                    for(var i = 0; i < this.requestInfoForm.scopes.length; i++) {
                        orcidGA.gaPush(['send', 'event', 'RegGrowth', auth_scope_prefix + this.requestInfoForm.scopes[i].name, 'OAuth ' + this.gaString]);
                    }
                }
                orcidGA.windowLocationHrefDelay(data.redirectUrl);

            },
            error => {
                console.log("An error occured authorizing the user.");
            } 
        );
    };


    loadAndInitAuthorizationForm(): void{
        this.oauthService.loadAndInitAuthorizationForm( )
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                this.authorizationForm = data;
            },
            error => {
                console.log("An error occured initializing the authorization form.");
            } 
        );

    };  

    loadRequestInfoForm(): void{
        this.oauthService.loadRequestInfoForm( )
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                if(data){
                    this.requestInfoForm = data;
                    
                    //check if email, orcid, given_names or family_names
                    //were included in oauth request and show signin or register
                    //http://members.orcid.org/api/resources/customize#pre-fill-form 
                    if(this.requestInfoForm.userId){
                        this.showRegisterForm = false;
                        this.authorizationForm = {
                            userName:  {value: this.requestInfoForm.userId}
                        } 
                    } else {
                        if(this.requestInfoForm.userEmail || this.requestInfoForm.userFamilyNames || this.requestInfoForm.userGivenNames){
                            this.showRegisterForm = true;
                        }
                    } 

                    this.requestInfoForm.scopes.forEach((scope) => {
                        if (scope.value.endsWith('/update')) {
                            this.showUpdateIcon = true;
                        } else if(scope.value.endsWith('/read-limited')) {
                            this.showLimitedIcon = true;
                        } else {
                            this.showBulletIcon = true;
                        }
                    });
                    this.gaString = orcidGA.buildClientString(this.requestInfoForm.memberName, this.requestInfoForm.clientName);
                }

            },
            error => {
                console.log("An error occured initializing the request info form.");
            } 
        );

    };

    oauth2ScreensLoadRegistrationForm(givenName, familyName, email, linkType): void{
        this.oauthService.oauth2ScreensLoadRegistrationForm( )
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                this.registrationForm = data;

                if(!this.registrationForm.givenNames.value){
                    this.registrationForm.givenNames.value=givenName;
                }
                if(!this.registrationForm.familyNames.value){
                    this.registrationForm.familyNames.value=familyName;
                }
                if(!this.registrationForm.email.value){
                    this.registrationForm.email.value=email;
                }
                if(!this.registrationForm.linkType){
                    this.registrationForm.linkType=linkType; 
                }

                this.registrationForm.activitiesVisibilityDefault.visibility = null;
                this.registrationForm.emailsAdditional=[{errors: [], getRequiredMessage: null, required: false, value: '',  }];                          
                
                this.showDeactivatedError = ($.inArray('orcid.frontend.verify.deactivated_email', this.registrationForm.email.errors) != -1);
                this.showReactivationSent = false;                
                
                for (var index in this.registrationForm.emailsAdditional) {
                    this.showEmailsAdditionalDeactivatedError.splice(index, 1, ($.inArray('orcid.frontend.verify.deactivated_email', this.registrationForm.emailsAdditional[index].errors) != -1));
                    this.showEmailsAdditionalReactivationSent.splice(index, 1, false);
                } 
                this.cdr.detectChanges(); 
            },
            error => {
                console.log("An error occured initializing the registration form.");
                console.error(`
__Server error__
(status:${error.status} (${error.statusText}) url: ${error.url})
name: "${error.name}"
message: "${error.message}"
ok: "${error.ok}"
            `)

            } 
        );

    };

    getDuplicates(): void{
        let url = getBaseUri() + '/dupicateResearcher.json?familyNames=' + this.registrationForm.familyNames.value + '&givenNames=' + this.registrationForm.givenNames.value;
        this.oauthService.getDuplicates( url )
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            duplicates => {
                var diffDate = new Date();
                // reg was filled out to fast reload the page
                if (this.loadTime + 5000 > diffDate.getTime()) {
                    window.location.reload();
                    return;
                }
                if (duplicates.length > 0 ) {
                    this.showRegisterProcessing = false;
                    this.openDialog(duplicates)
                } else {
                    this.oauth2ScreensPostRegisterConfirm();                          
                }

            },
            error => {
                // something bad is happening!
                console.log("error fetching dupicateResearcher.json");
                // continue to registration, as solr dup lookup failed.
                this.oauth2ScreensPostRegisterConfirm();
        } 
        );

    };


    openDialog(duplicateRecords): void {
        const dialogParams = {
            width: `1078px`,
            height: `600px`,
            maxWidth: `90vw`,
            
            data: {
                duplicateRecords,
                titleLabel: this.titleLabel.nativeElement.innerHTML,
                bodyLabel:this.bodyLabel.nativeElement.innerHTML,
                contactLabel: this.contactLabel.nativeElement.innerHTML,
                firstNameLabel: this.firstNameLabel.nativeElement.innerHTML,
                affiliationsLabel: this.affiliationsLabel.nativeElement.innerHTML,
                dateCreatedLabel: this.dateCreatedLabel.nativeElement.innerHTML,
                viewRecordLabel: this.viewRecordLabel.nativeElement.innerHTML,
                signinLabel: this.signinLabel.nativeElement.innerHTML,
                continueLabel: this.continueLabel.nativeElement.innerHTML,

            }
        }
          
        if (this.isMobileView){
            dialogParams["maxWidth"] = "95vw"
            dialogParams["maxHeight"] = "95vh"
        }

        const dialogRef = this.dialog.open(IsThisYouComponent, dialogParams);

        dialogRef.afterClosed().subscribe(confirmRegistration => {
            if (confirmRegistration) {
                this.oauth2ScreensPostRegisterConfirm()
            }
        });
    }

    sendReactivationEmail(email, $event?): void {        
        if ($event) {
            $event.preventDefault()
        }
        this.oauthService.sendReactivationEmail(email)
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                this.initReactivationRequest = data;
                if(this.initReactivationRequest.error == null || this.initReactivationRequest.error == '') {
                    this.showDeactivatedError = false;
                    this.showReactivationSent = true;                    
                } else {
                    //Restore the email address
                    this.initReactivationRequest.email = email;
                    this.showDeactivatedError = true;
                    this.showReactivationSent = false;                    
                }
                this.cdr.detectChanges();
            },
            error => {
                console.log("error sending reactivation email");
            } 
        );
    };

    sendEmailsAdditionalReactivationEmail(index): void {
        this.showEmailsAdditionalDeactivatedError.splice(index, 1, false);
        this.showEmailsAdditionalReactivationSent.splice(index, 1, true);

        this.oauthService.sendReactivationEmail(this.registrationForm.emailsAdditional[index].value)
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
            },
            error => {
                console.log("error sending reactivation email");
            } 
        );
    };

    oauth2ScreensPostRegisterConfirm(): void {
        this.registrationForm.valNumClient = this.registrationForm.valNumServer / 2;
        this.oauthService.oauth2ScreensPostRegisterConfirm(this.registrationForm)
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                if(data != null && data.errors != null && data.errors.length > 0) {
                    this.generalRegistrationError = data.errors[0];
                    this.showGeneralRegistrationError = true;
                    this.showRegisterProcessing = false;
                    this.modalService.notifyOther({action:'close', moduleId: 'modalRegisterDuplicates'});
                    this.cdr.detectChanges();
                } else {
                    if (this.gaString){
                        orcidGA.gaPush(['send', 'event', 'RegGrowth', 'New-Registration', 'OAuth ' + this.gaString]);
                    } else {
                        orcidGA.gaPush(['send', 'event', 'RegGrowth', 'New-Registration', 'Website']);
                    } 
                    orcidGA.windowLocationHrefDelay(data.url);
                }   
            },
            error => {
                // something bad is happening!
                console.error(`
__Server error__
(status:${error.status} (${error.statusText}) url: ${error.url})
name: "${error.name}"
message: "${error.message}"
ok: "${error.ok}"
            `)

            } 
        );
    };
    showPasswordPatterError ( errors : string[] ) {
        return  !errors ? errors :
        errors.filter(error => error.indexOf('Pattern.') >= 0 ).length && this.theFormWasSubmittedAndHasSomeErrors
    }

    showFormHasError () {
        const hasErrors = Object.keys(this.registrationForm)
            .find(field => this.registrationForm[field] && 
                           this.registrationForm[field]['errors'] && 
                           this.registrationForm[field]['errors'].length )
                           
        return hasErrors && this.theFormWasSubmittedAndHasSomeErrors
    }

    oauth2ScreensRegister(linkFlag): void {
        if (this.gaString) {
            this.registrationForm.referredBy = this.requestInfoForm.clientId;
            this.registrationForm.creationType.value = "Member-referred";
            orcidGA.gaPush(['send', 'event', 'RegGrowth', 'New-Registration-Submit' , 'OAuth ' + this.gaString]);
        } else {
            orcidGA.gaPush(['send', 'event', 'RegGrowth', 'New-Registration-Submit', 'Website']);
            this.registrationForm.creationType.value = "Direct";
        } 

        // Adding the response to the register object
        this.registrationForm.grecaptcha.value = this.recatchaResponse; 
        this.registrationForm.grecaptchaWidgetId.value = this.recaptchaWidgetId;
        
        this.registrationForm.linkType = linkFlag;

        this.oauthService.oauth2ScreensRegister(this.registrationForm)
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                this.registrationForm = data;
                if (this.registrationForm.errors == undefined 
                    || this.registrationForm.errors.length == 0) {                                 
                    this.getDuplicates();
                } else {
                    this.theFormWasSubmittedAndHasSomeErrors = true
                    if(this.registrationForm.email.errors.length > 0) {
                        this.errorEmail = data.email.value;
                        //deactivated error
                        this.showDeactivatedError = ($.inArray('orcid.frontend.verify.deactivated_email', this.registrationForm.email.errors) != -1);
                        this.showReactivationSent = false;
                        //duplicate email error
                        if($.inArray('orcid.frontend.verify.duplicate_email', this.registrationForm.email.errors) != -1){ 
                            this.showDuplicateEmailError = true;
                            this.authorizationForm.userName.value = this.registrationForm.email.value;
                        } 
                    } else {
                        this.showDeactivatedError = false;
                        this.showDuplicateEmailError = false;
                    }

                    for (var index in this.registrationForm.emailsAdditional) {
                        if (this.registrationForm.emailsAdditional[index].errors.length > 0) {      
                            this.errorEmailsAdditional[index] = data.emailsAdditional[index].value;     
                            //deactivated error
                            this.showEmailsAdditionalDeactivatedError.splice(index, 1, ($.inArray('orcid.frontend.verify.deactivated_email', this.registrationForm.emailsAdditional[index].errors) != -1));
                            this.showEmailsAdditionalReactivationSent.splice(index, 1, false);
                            //duplicate email error
                            this.showEmailsAdditionalDuplicateEmailError.splice(index, 1, ($.inArray('orcid.frontend.verify.duplicate_email', this.registrationForm.emailsAdditional[index].errors) != -1));
                            this.authorizationForm.userName.value = this.registrationForm.emailsAdditional[index].value;
                        } else {
                            this.showEmailsAdditionalDeactivatedError[index] = false;
                            this.showEmailsAdditionalDuplicateEmailError[index] = false;
                        } 
                    }

                    if (this.registrationForm.grecaptcha.errors.length == 0) {
                        this.showRecaptcha = false;
                    }
                }
                this.cdr.detectChanges();
            },
            error => {
                // something bad is happening!
                console.log("oauth2ScreensRegister() error");
                console.error(`
__Server error__
(status:${error.status} (${error.statusText}) url: ${error.url})
name: "${error.name}"
message: "${error.message}"
ok: "${error.ok}"
            `)
            } 
        );
    };

    serverValidate(field): void {
        this.oauthService.serverValidate(this.registrationForm, field)
        .pipe(    
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
            data => {
                this.commonSrvc.copyErrorsLeft(this.registrationForm, data);
                if(field == 'Email') {
                    if (this.registrationForm.email.errors.length > 0) {
                        this.errorEmail = data.email.value;
                        //deactivated error
                        this.showDeactivatedError = ($.inArray('orcid.frontend.verify.deactivated_email', this.registrationForm.email.errors) != -1);
                        this.showReactivationSent = false;
                        //duplicate email error
                        if($.inArray('orcid.frontend.verify.duplicate_email', this.registrationForm.email.errors) != -1){ 
                            this.showDuplicateEmailError = true;
                            this.authorizationForm.userName.value = this.registrationForm.email.value;
                        } 
                    } else {
                        this.showDeactivatedError = false;
                        this.showDuplicateEmailError = false;
                    } 
                }
                if(field == 'EmailsAdditional') {
                    for (var index in this.registrationForm.emailsAdditional) {
                        if (this.registrationForm.emailsAdditional[index].errors && this.registrationForm.emailsAdditional[index].errors.length > 0) {      
                            this.errorEmailsAdditional[index] = data.emailsAdditional[index].value;     
                            //deactivated error
                            this.showEmailsAdditionalDeactivatedError.splice(index, 1, ($.inArray('orcid.frontend.verify.deactivated_email', this.registrationForm.emailsAdditional[index].errors) != -1));
                            this.showEmailsAdditionalReactivationSent.splice(index, 1, false);
                            //duplicate email error
                            this.showEmailsAdditionalDuplicateEmailError.splice(index, 1, ($.inArray('orcid.frontend.verify.duplicate_email', this.registrationForm.emailsAdditional[index].errors) != -1));
                            this.authorizationForm.userName.value = this.registrationForm.emailsAdditional[index].value;
                        } else {
                            this.showEmailsAdditionalDeactivatedError[index] = false;
                            this.showEmailsAdditionalDuplicateEmailError[index] = false;
                        }
                    }                          
                }
                this.cdr.detectChanges();
                
            },
            error => {
                // something bad is happening!
                console.log("serverValidate() error");
            } 
        );
    };

    showDuplicatesColorBox(): void {
        this.modalService.notifyOther({action:'open', moduleId: 'modalRegisterDuplicates'});
    };

    handleCaptchaResponse($event): void {
        this.recaptchaWidgetId = this.captcha.widgetId;
        this.recatchaResponse = this.captcha.getResponse();
    };

    //Default init functions provided by Angular Core
    ngAfterViewInit() {
        //Fire functions AFTER the view inited. Useful when DOM is required or access children directives
    };

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };

    ngOnInit() {
        var urlParams = new URLSearchParams(window.location.search);

        //params sent if user clicked link in claim email
        if(urlParams.has('alreadyClaimed')){
            this.alreadyClaimed = true;
        }
        if(urlParams.has('invalidClaimUrl')){
            this.invalidClaimUrl = true;
        }

        //param sent if user clicked link in error msg on register or reactivate
        if(urlParams.has('loginId')){
            loginId = urlParams.get('loginId');
        }

        //param sent to force register form display
        if(urlParams.has('show_login')){
            if(urlParams.get('show_login')=='false'){
                this.showRegisterForm = true; 
            }
        }

        //param sent if user came via oauth
        if(urlParams.has('oauth') || (window.location.pathname.indexOf("/oauth") > -1)){
            this.oauthRequest = true;
        }

        //params sent if user came from link social or link insitutional
        var loginId = "";
        var firstName = "";
        var lastName = "";
        var emailId = "";

        if(urlParams.has('firstName')){
            firstName = urlParams.get('firstName');
        }
        if(urlParams.has('lastName')){
            lastName = urlParams.get('lastName');
        }
        if(urlParams.has('emailId')){
            emailId = urlParams.get('emailId');
        }
        if(urlParams.has('linkRequest')){
            this.isLinkRequest = true;
            this.linkType = urlParams.get('linkRequest');
        }        

        this.authorizationForm = {
            userName:  {value: loginId},
            givenNames:  {value: ""},
            familyNames:  {value: ""},
            email:  {value: ""},
            linkType:  {value: null},
        }

        this.registrationForm = {
            userName:  {value: null},
            givenNames:  {value: null},
            familyNames:  {value: null},
            email:  {value: null},
            password: {value: null},
            passwordConfirm: {value: null},
            activitiesVisibilityDefault: {visibility: null},
            sendOrcidNews: {value: null},
            termsOfUse: {value: null},
            linkType:  {value: null},
        }

        //if oauth request load request info form
        if(this.oauthRequest){
            this.loadRequestInfoForm();
        } 

        $('#enterRecoveryCode').click(function() {
            $('#recoveryCodeSignin').show(); 
        });

        //load registration form with link account params
        this.oauth2ScreensLoadRegistrationForm(firstName, lastName, emailId, this.linkType);

        this.subscription = this.oauthService.notifyObservable$.subscribe(
            (res) => {
                if(res !== "undefined" && res.action === "confirm" && res.moduleId === "registerDuplicates"){
                    this.oauth2ScreensPostRegisterConfirm();
                }
            }
        );

        this.commonSrvc.getUserStatus().subscribe( 
            data => {
                if(data.loggedIn == true) {
                    if (this.togglzReLoginAlert && !this.oauthRequest) {
                        this.nameService.getData(this.nameFormUrl).subscribe(response => {
                            if (response.real && (response.real.givenNames.value || response.real.familyName.value)) {
                                var giveNamesDefined = (response.real.givenNames && response.real.givenNames.value);
                                var familyNameDefined = (response.real.familyName && response.real.familyName.value);
                                this.realLoggedInUserName = "";
                                this.realLoggedInUserName += giveNamesDefined ? response.real.givenNames.value : "";
                                this.realLoggedInUserName += giveNamesDefined && familyNameDefined ? " " : "";
                                this.realLoggedInUserName += familyNameDefined ? response.real.familyName.value : "";
                            } 
                            if (response.effective && (response.effective.givenNames.value || response.effective.familyName.value)) {
                                var giveNamesDefined = (response.effective.givenNames && response.effective.givenNames.value);
                                var familyNameDefined = (response.effective.familyName && response.effective.familyName.value);
                                this.effectiveLoggedInUserName = "";
                                this.effectiveLoggedInUserName += giveNamesDefined ? response.effective.givenNames.value : "";
                                this.effectiveLoggedInUserName += giveNamesDefined && familyNameDefined ? " " : "";
                                this.effectiveLoggedInUserName += familyNameDefined ? response.effective.familyName.value : ""; 
                            }  
                            this.isLoggedIn = true;   
                        }, (error) => {
                            console.log('Error getting public name')
                            this.isLoggedIn = false;
                        })
                    }
                } else {
                    this.isLoggedIn = false;
                }
            },
            error => {
                console.log('oauthAuthorization: ngOnInit error', error);
            } 
        );
    };
    
    getBaseUri() : String {
        return getBaseUri();
    };
}

@Component({
    selector: 'dialog-overview-example-dialog',
    template: '<h1 mat-dialog-title>Hi {{data}}</h1>',
  })
  export class DialogOverviewExampleDialog {
  
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }