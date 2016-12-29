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
package org.orcid.api.memberV2.server.delegator;

import static org.hamcrest.core.AnyOf.anyOf;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.security.AccessControlException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.persistence.NoResultException;
import javax.ws.rs.core.Response;
import org.orcid.test.DBUnitTest;
import org.orcid.test.helper.Utils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.orcid.core.exception.OrcidUnauthorizedException;
import org.orcid.core.exception.OrcidVisibilityException;
import org.orcid.core.exception.VisibilityMismatchException;
import org.orcid.core.exception.WrongSourceException;
import org.orcid.core.utils.SecurityContextTestUtils;
import org.orcid.jaxb.model.common_rc4.LastModifiedDate;
import org.orcid.jaxb.model.common_rc4.Visibility;
import org.orcid.jaxb.model.groupid_rc4.GroupIdRecord;
import org.orcid.jaxb.model.message.ScopePathType;
import org.orcid.jaxb.model.record_rc4.Address;
import org.orcid.jaxb.model.record_rc4.Education;
import org.orcid.jaxb.model.record_rc4.Employment;
import org.orcid.jaxb.model.record_rc4.Funding;
import org.orcid.jaxb.model.record_rc4.Keyword;
import org.orcid.jaxb.model.record_rc4.OtherName;
import org.orcid.jaxb.model.record_rc4.OtherNames;
import org.orcid.jaxb.model.record_rc4.PeerReview;
import org.orcid.jaxb.model.record_rc4.PersonExternalIdentifier;
import org.orcid.jaxb.model.record_rc4.ResearcherUrl;
import org.orcid.jaxb.model.record_rc4.Work;
import org.orcid.jaxb.model.record_rc4.WorkBulk;
import org.orcid.test.OrcidJUnit4ClassRunner;
import org.springframework.test.context.ContextConfiguration;

@RunWith(OrcidJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:orcid-api-web-context.xml", "classpath:orcid-api-security-context.xml" })
public class MemberV2ApiServiceDelegator_OtherNamesTest extends DBUnitTest {
    protected static final List<String> DATA_FILES = Arrays.asList("/data/EmptyEntityData.xml", "/data/SecurityQuestionEntityData.xml",
            "/data/SourceClientDetailsEntityData.xml", "/data/ProfileEntityData.xml", "/data/ClientDetailsEntityData.xml", "/data/RecordNameEntityData.xml",
            "/data/BiographyEntityData.xml");

    // Now on, for any new test, PLAESE USER THIS ORCID ID
    protected final String ORCID = "0000-0000-0000-0003";

    @Resource(name = "memberV2ApiServiceDelegator")
    protected MemberV2ApiServiceDelegator<Education, Employment, PersonExternalIdentifier, Funding, GroupIdRecord, OtherName, PeerReview, ResearcherUrl, Work, WorkBulk, Address, Keyword> serviceDelegator;

    @BeforeClass
    public static void initDBUnitData() throws Exception {
        initDBUnitData(DATA_FILES);
    }

    @AfterClass
    public static void removeDBUnitData() throws Exception {
        Collections.reverse(DATA_FILES);
        removeDBUnitData(DATA_FILES);
    }

    @Test(expected = OrcidUnauthorizedException.class)
    public void testViewOtherNamesWrongToken() {
        SecurityContextTestUtils.setUpSecurityContext("some-other-user", ScopePathType.READ_LIMITED);
        serviceDelegator.viewOtherNames(ORCID);
    }

    @Test(expected = OrcidUnauthorizedException.class)
    public void testViewOtherNameWrongToken() {
        SecurityContextTestUtils.setUpSecurityContext("some-other-user", ScopePathType.READ_LIMITED);
        serviceDelegator.viewOtherName(ORCID, 13L);
    }

    @Test
    public void testViewOtherNameReadPublic() {
        SecurityContextTestUtils.setUpSecurityContextForClientOnly("some-client", ScopePathType.READ_PUBLIC);
        Response r = serviceDelegator.viewOtherName(ORCID, 13L);
        OtherName element = (OtherName) r.getEntity();
        assertNotNull(element);
        Utils.assertIsPublicOrSource(element, "some-client");
    }

    @Test
    public void testViewOtherNamesReadPublic() {
        SecurityContextTestUtils.setUpSecurityContextForClientOnly("some-client", ScopePathType.READ_PUBLIC);
        Response r = serviceDelegator.viewOtherNames(ORCID);
        OtherNames element = (OtherNames) r.getEntity();
        assertNotNull(element);
        Utils.assertIsPublicOrSource(element, "some-client");
    }

    @Test
    public void testViewOtherNames() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_READ_LIMITED);
        Response response = serviceDelegator.viewOtherNames("4444-4444-4444-4446");
        assertNotNull(response);
        OtherNames otherNames = (OtherNames) response.getEntity();
        assertNotNull(otherNames);
        Utils.verifyLastModified(otherNames.getLastModifiedDate());
        assertNotNull(otherNames.getOtherNames());
        assertEquals(3, otherNames.getOtherNames().size());
        for (OtherName otherName : otherNames.getOtherNames()) {
            Utils.verifyLastModified(otherName.getLastModifiedDate());
            assertThat(otherName.getPutCode(), anyOf(is(5L), is(6L), is(8L)));
            assertThat(otherName.getContent(), anyOf(is("Other Name # 1"), is("Other Name # 2"), is("Other Name # 4")));
            if (otherName.getPutCode() == 5L) {
                assertEquals(Visibility.PUBLIC, otherName.getVisibility());
                assertEquals("APP-5555555555555555", otherName.getSource().retrieveSourcePath());
            } else if (otherName.getPutCode() == 6L) {
                assertEquals(Visibility.LIMITED, otherName.getVisibility());
                assertEquals("4444-4444-4444-4446", otherName.getSource().retrieveSourcePath());
            } else {
                assertEquals(Visibility.PRIVATE, otherName.getVisibility());
                assertEquals("APP-5555555555555555", otherName.getSource().retrieveSourcePath());
            }
        }
    }

    @Test
    public void testViewPublicOtherName() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_READ_LIMITED);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4446", 5L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        Utils.verifyLastModified(otherName.getLastModifiedDate());
        assertEquals("Other Name # 1", otherName.getContent());
        assertEquals(Visibility.PUBLIC, otherName.getVisibility());
        assertEquals("APP-5555555555555555", otherName.getSource().retrieveSourcePath());
    }

    @Test
    public void testViewLimitedOtherName() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_READ_LIMITED);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4446", 6L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        Utils.verifyLastModified(otherName.getLastModifiedDate());
        assertEquals("Other Name # 2", otherName.getContent());
        assertEquals(Visibility.LIMITED, otherName.getVisibility());
        assertEquals("4444-4444-4444-4446", otherName.getSource().retrieveSourcePath());
    }

    @Test
    public void testViewPrivateOtherName() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_READ_LIMITED);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4446", 8L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        Utils.verifyLastModified(otherName.getLastModifiedDate());
        assertEquals("Other Name # 4", otherName.getContent());
        assertEquals(Visibility.PRIVATE, otherName.getVisibility());
        assertEquals("APP-5555555555555555", otherName.getSource().retrieveSourcePath());
    }

    @Test(expected = OrcidVisibilityException.class)
    public void testViewPrivateOtherNameWhereYouAreNotTheSource() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_READ_LIMITED);
        serviceDelegator.viewOtherName("4444-4444-4444-4446", 7L);
        fail();
    }

    @Test(expected = NoResultException.class)
    public void testViewOtherNameThatDontBelongToTheUser() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_READ_LIMITED);
        serviceDelegator.viewOtherName("4444-4444-4444-4446", 1L);
        fail();
    }

    @Test
    public void testAddOtherName() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4441", ScopePathType.PERSON_READ_LIMITED, ScopePathType.PERSON_UPDATE);
        Response response = serviceDelegator.createOtherName("4444-4444-4444-4441", Utils.getOtherName());
        assertNotNull(response);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        Map<?, ?> map = response.getMetadata();
        assertNotNull(map);
        assertTrue(map.containsKey("Location"));
        List<?> resultWithPutCode = (List<?>) map.get("Location");
        Long putCode = Long.valueOf(String.valueOf(resultWithPutCode.get(0)));

        response = serviceDelegator.viewOtherName("4444-4444-4444-4441", putCode);
        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        OtherName newOtherName = (OtherName) response.getEntity();
        assertNotNull(newOtherName);
        Utils.verifyLastModified(newOtherName.getLastModifiedDate());
        assertEquals("New Other Name", newOtherName.getContent());
        assertEquals(Visibility.PUBLIC, newOtherName.getVisibility());
        assertNotNull(newOtherName.getSource());
        assertEquals("APP-5555555555555555", newOtherName.getSource().retrieveSourcePath());
        assertNotNull(newOtherName.getCreatedDate());
        Utils.verifyLastModified(newOtherName.getLastModifiedDate());
    }

    @Test
    public void testUpdateOtherName() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4443", ScopePathType.PERSON_READ_LIMITED, ScopePathType.PERSON_UPDATE);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4443", 1L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        Utils.verifyLastModified(otherName.getLastModifiedDate());
        LastModifiedDate before = otherName.getLastModifiedDate();
        assertEquals("Slibberdy Slabinah", otherName.getContent());
        assertEquals(Visibility.PUBLIC, otherName.getVisibility());

        otherName.setContent("Updated Other Name");

        response = serviceDelegator.updateOtherName("4444-4444-4444-4443", 1L, otherName);
        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        response = serviceDelegator.viewOtherName("4444-4444-4444-4443", 1L);
        assertNotNull(response);
        OtherName updatedOtherName = (OtherName) response.getEntity();
        assertNotNull(updatedOtherName);
        Utils.verifyLastModified(updatedOtherName.getLastModifiedDate());
        assertTrue(updatedOtherName.getLastModifiedDate().after(before));
        assertEquals("Updated Other Name", updatedOtherName.getContent());
        assertEquals(Visibility.PUBLIC, updatedOtherName.getVisibility());
    }

    @Test(expected = WrongSourceException.class)
    public void testUpdateOtherNameYouAreNotTheSourceOf() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4443", ScopePathType.PERSON_READ_LIMITED, ScopePathType.PERSON_UPDATE);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4443", 2L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        assertEquals("Flibberdy Flabinah", otherName.getContent());
        assertEquals(Visibility.PUBLIC, otherName.getVisibility());

        otherName.setContent("Updated Other Name " + System.currentTimeMillis());

        serviceDelegator.updateOtherName("4444-4444-4444-4443", 2L, otherName);
        fail();
    }

    @Test(expected = VisibilityMismatchException.class)
    public void testUpdateOtherNameChangingVisibilityTest() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4443", ScopePathType.PERSON_READ_LIMITED, ScopePathType.PERSON_UPDATE);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4443", 1L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        assertEquals(Visibility.PUBLIC, otherName.getVisibility());

        otherName.setVisibility(Visibility.PRIVATE);

        response = serviceDelegator.updateOtherName("4444-4444-4444-4443", 1L, otherName);
        fail();
    }

    @Test
    public void testUpdateOtherNameLeavingVisibilityNullTest() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4443", ScopePathType.PERSON_READ_LIMITED, ScopePathType.PERSON_UPDATE);
        Response response = serviceDelegator.viewOtherName("4444-4444-4444-4443", 1L);
        assertNotNull(response);
        OtherName otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        assertEquals(Visibility.PUBLIC, otherName.getVisibility());

        otherName.setVisibility(null);

        response = serviceDelegator.updateOtherName("4444-4444-4444-4443", 1L, otherName);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        otherName = (OtherName) response.getEntity();
        assertNotNull(otherName);
        assertEquals(Visibility.PUBLIC, otherName.getVisibility());
    }

    @Test
    public void testDeleteOtherName() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4447", ScopePathType.PERSON_READ_LIMITED, ScopePathType.PERSON_UPDATE);
        Response response = serviceDelegator.viewOtherNames("4444-4444-4444-4447");
        assertNotNull(response);
        OtherNames otherNames = (OtherNames) response.getEntity();
        assertNotNull(otherNames);
        assertNotNull(otherNames.getOtherNames());
        assertEquals(1, otherNames.getOtherNames().size());
        response = serviceDelegator.deleteOtherName("4444-4444-4444-4447", 9L);
        assertNotNull(response);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        response = serviceDelegator.viewOtherNames("4444-4444-4444-4447");
        assertNotNull(response);
        otherNames = (OtherNames) response.getEntity();
        assertNotNull(otherNames);
        assertNotNull(otherNames.getOtherNames());
        assertTrue(otherNames.getOtherNames().isEmpty());
    }

    @Test
    public void testReadPublicScope_OtherNames() {
        SecurityContextTestUtils.setUpSecurityContext(ORCID, ScopePathType.READ_PUBLIC);
        // Public works
        Response r = serviceDelegator.viewOtherNames(ORCID);
        assertNotNull(r);
        assertEquals(OtherNames.class.getName(), r.getEntity().getClass().getName());
        OtherNames o = (OtherNames) r.getEntity();
        assertNotNull(o);
        Utils.verifyLastModified(o.getLastModifiedDate());
        assertEquals(3, o.getOtherNames().size());
        boolean found1 = false, found2 = false, found3 = false;
        for (OtherName element : o.getOtherNames()) {
            Utils.verifyLastModified(element.getLastModifiedDate());
            if (element.getPutCode() == 13) {
                found1 = true;
            } else if (element.getPutCode() == 14) {
                found2 = true;
            } else if (element.getPutCode() == 15) {
                found3 = true;
            } else {
                fail("Invalid put code " + element.getPutCode());
            }

        }
        assertTrue(found1);
        assertTrue(found2);
        assertTrue(found3);

        r = serviceDelegator.viewOtherName(ORCID, 13L);
        assertNotNull(r);
        assertEquals(OtherName.class.getName(), r.getEntity().getClass().getName());

        // Limited where am the source should work
        serviceDelegator.viewOtherName(ORCID, 14L);

        // Limited where am not the source of should fail
        try {
            serviceDelegator.viewOtherName(ORCID, 16L);
            fail();
        } catch (AccessControlException e) {

        } catch (Exception e) {
            fail();
        }

        // Private where am the source should work
        serviceDelegator.viewOtherName(ORCID, 15L);
        // Private where am not the source should work
        try {
            serviceDelegator.viewOtherName(ORCID, 17L);
            fail();
        } catch (AccessControlException e) {

        } catch (Exception e) {
            fail();
        }
    }

    @Test(expected = WrongSourceException.class)
    public void testDeleteOtherNameYouAreNotTheSourceOf() {
        SecurityContextTestUtils.setUpSecurityContext("4444-4444-4444-4446", ScopePathType.PERSON_UPDATE, ScopePathType.PERSON_UPDATE);
        serviceDelegator.deleteOtherName("4444-4444-4444-4446", 6L);
        fail();
    }
}
