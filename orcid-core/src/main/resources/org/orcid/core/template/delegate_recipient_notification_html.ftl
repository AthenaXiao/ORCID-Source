<#import "email_macros.ftl" as emailMacros />
<#escape x as x?html>
    <!DOCTYPE html>
    <html>
    <head>
        <title>${subject}</title>
    </head>
    <body>
        <p>
            <@emailMacros.msg "notification.delegate.receipt.accountDelegate" />
            <@emailMacros.space />${emailNameGrantingPermission}<@emailMacros.space />
            <a style="text-decoration: underline;color: #085c77;" href="${baseUri}/${grantingOrcidValue}">
                (${baseUri}/${grantingOrcidValue})
            </a>
        <p>
            <@emailMacros.msg "notification.delegate.receipt.accountDelegateMeans" />
            <@emailMacros.space />${emailNameGrantingPermission}<@emailMacros.space />
            <@emailMacros.msg "notification.delegate.receipt.orcidRecord" />
        </p>
        <p>
            <@emailMacros.msg "notification.delegate.receipt.tutorial" /><@emailMacros.space />
            <a style="text-decoration: underline;color: #085c77;" href="https://support.orcid.org/hc/articles/360006973613">
                <@emailMacros.msg "notification.delegate.receipt.tutorialLink" />
            </a>
        </p>
        <p>
            <@emailMacros.msg "notification.delegate.receipt.questions" /><@emailMacros.space />${emailNameGrantingPermission}<@emailMacros.space />
            <a style="text-decoration: underline;color: #085c77;" href="mailto:${grantingOrcidEmail}">(${grantingOrcidEmail})</a>
            <@emailMacros.space />
            <@emailMacros.msg "notification.delegate.receipt.helpDesk" /><@emailMacros.space />
            <a style="text-decoration: underline;color: #085c77;" href="https://orcid.org/help/contact-us">
                <@emailMacros.msg "notification.delegate.receipt.helpDeskLink" />
            </a>
        </p>
    </body>
    </html>
</#escape>
