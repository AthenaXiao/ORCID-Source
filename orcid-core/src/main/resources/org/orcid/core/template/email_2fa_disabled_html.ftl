<#import "email_macros.ftl" as emailMacros />
<#escape x as x?html>
<!DOCTYPE html>
<html>
  <head>
  <title>${subject}</title>
  </head>
  <body>
    <div style="padding: 20px; padding-top: 0px;">
      <img src="https://orcid.org/sites/all/themes/orcid/img/orcid-logo.png" alt="ORCID.org"/>
        <hr />
        <span style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C; font-weight: bold;">
          <@emailMacros.msg "email.common.dear" /><@emailMacros.space />${emailName}<@emailMacros.msg "email.common.dear.comma" />
        </span>
        <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">
          <@emailMacros.msg "email.2fa_disabled.two_factor_auth_disabled" />
        </p>
     
        <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">
          <@emailMacros.msg "email.2fa_disabled.if_you_received.html" />
        </p>
        <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">
          <@emailMacros.msg "email.2fa_disabled.no_reply" />
        </p> 
        <p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">
          <@emailMacros.msg "email.2fa_disabled.more_info.html" />
        </p>  
        <p style="font-family: arial,  helvetica, sans-serif;font-size: 15px;color: #494A4C; white-space: pre;">
          <@emailMacros.msg "email.common.warm_regards" />
         </p>
        <p style="font-family: arial,  helvetica, sans-serif;font-size: 15px;color: #494A4C;">
          <a href="${baseUri}/home?lang=${locale}">${baseUri}/<a/>
        </p>
        <p style="font-family: arial,  helvetica, sans-serif;font-size: 15px;color: #494A4C;">
          <@emailMacros.msg "email.common.you_have_received_this_email" />
        </p>
        <p style="font-family: arial,  helvetica, sans-serif;font-size: 15px;color: #494A4C;">
         <#include "email_footer_html.ftl"/>
        </p> 
     </div>
   </body>
 </html>
 </#escape>
