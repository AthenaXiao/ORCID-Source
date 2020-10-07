<#import "email_macros.ftl" as emailMacros />

<#include "notification_header.ftl"/>
<@emailMacros.msg "notification.delegate.record" />

${emailNameForDelegate}<@emailMacros.space /><@emailMacros.msg "notification.delegate.trustedIndividual" />

<@emailMacros.msg "notification.delegate.added" /><@emailMacros.space />${emailNameForDelegate}<@emailMacros.space /><@emailMacros.msg "notification.delegate.asTrustedIndividual" />

<@emailMacros.msg "notification.delegate.accessYourRecord" /><@emailMacros.space /><@emailMacros.msg "notification.delegate.settings" />
<#include "notification_footer.ftl"/>
