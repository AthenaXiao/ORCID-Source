<img src="https://orcid.org/sites/all/themes/orcid/img/orcid-logo.png" alt="ORCID.org"/>
<hr style="color: #e0e0e0;border-style: solid;border-width: 2px;" />
<p>
    <@emailMacros.msg "notification.header.hi" /><@emailMacros.space />${emailName}
    <a style="text-decoration: underline;color: #085c77;" href="${baseUri}/${orcidValue}">
        (${baseUri}/${orcidValue})
    </a>
</p>
<p>
    <@emailMacros.msg "notification.header.gotNewNotifications" />
    <a style="text-decoration: underline;color: #085c77;" href="${baseUri}/inbox">
        <@emailMacros.msg "notification.header.visit" />
    </a>
</p>
<br>
<h3 style="font-size: 18px;font-weight: bold;">
    <@emailMacros.msg "notification.header.newNotifications" />
</h3>