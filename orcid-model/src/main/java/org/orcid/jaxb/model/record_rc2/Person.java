/**
 * =============================================================================
 *
 * ORCID (R) Open Source
 * http://orcid.org
 *
 * Copyright (c) 2012-2014 ORCID, Inc.
 * Licensed under an MIT-Style License (MIT)
 * http://orcid.org/open-source-license
 *
 * This copyright and license information (including a link to the full license)
 * shall be included in its entirety in all copies or substantial portion of
 * the software.
 *
 * =============================================================================
 */
package org.orcid.jaxb.model.record_rc2;

import java.io.Serializable;

public class Person implements Serializable {

    Name name;
    OtherNames otherNames;
    Biography biography;
    ResearcherUrls researcherUrls;
    Emails emails;
    Addresses addresses;
    Keywords keywords;
    ExternalIdentifiers externalIdentifiers;
    Delegation delegation;
}
