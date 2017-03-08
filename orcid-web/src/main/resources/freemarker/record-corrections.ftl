<#--

    =============================================================================

    ORCID (R) Open Source
    http://orcid.org

    Copyright (c) 2012-2014 ORCID, Inc.
    Licensed under an MIT-Style License (MIT)
    http://orcid.org/open-source-license

    This copyright and license information (including a link to the full license)
    shall be included in its entirety in all copies or substantial portion of
    the software.

    =============================================================================

-->
<script type="text/ng-template" id="record-correction-more-info">	
	<div class="lightbox-container" id="record-correction-more-info">
		<div class="row">
			<div class="col-md-3 col-sm-3 col-xs-3">
				<p class="italic"><@orcid.msg 'record_corrections.date'/>:</p>
			</div>
			<div class="col-md-9 col-sm-9 col-xs-9">
				<span ng-bind="currentElement.dateCreated | date:'yyyy-MM-dd HH:mm:ss'"></span>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3 col-sm-3 col-xs-3">
				<p class="italic"><@orcid.msg 'record_corrections.description'/>:</p>
			</div>
			<div class="col-md-9 col-sm-9 col-xs-9">
				<p><span ng-bind="currentElement.description"></span></p>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3 col-sm-3 col-xs-3">
				<p class="italic"><@orcid.msg 'record_corrections.num_modified'/>:</p>
			</div>
			<div class="col-md-9 col-sm-9 col-xs-9">
				<p><span ng-bind="currentElement.numChanged"></span></p>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3 col-sm-3 col-xs-3">
				<p class="italic"><@orcid.msg 'record_corrections.sql'/>:</p>
			</div>
			<div class="col-md-9 col-sm-9 col-xs-9">
				<p><span ng-bind="currentElement.sqlUsedToUpdate"></span></p>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3 col-sm-3 col-xs-3">
				<p class="italic"><@orcid.msg 'record_corrections.type'/>:</p>
			</div>
			<div class="col-md-9 col-sm-9 col-xs-9">
				<p><span ng-bind="currentElement.type"></span></p>
			</div>
		</div>						
	</div>		
</script>

<@public>
	<div class="row">	    
	    <div class="col-md-9 col-md-offset-3">
	    	<h1><@orcid.msg 'record_corrections.heading'/></h1>
	    	<p><@orcid.msg 'record_corrections.a_core'/>&nbsp;<a href="<@orcid.rootPath '/about/trust/home'/>"><@orcid.msg 'record_corrections.orcid_trust'/></a>&nbsp;<@orcid.msg 'record_corrections.principle_is'/></p>
	    	<hr>	    	
	    	<div ng-controller="RecordCorrectionsCtrl">
	    		<div ng-show="currentPage.recordCorrections.length > 0" >
	    			<div class="row heading">
	    				<div class="col-md-3 col-sm-12 col-xs-12">
		    				<p class="italic"><@orcid.msg 'record_corrections.date'/></p>    				
		    			</div>
		    			<div class="col-md-8 col-sm-12 col-xs-12">
		    				<p class="italic"><@orcid.msg 'record_corrections.description'/></p>
		    			</div>
		    			<div class="col-md-1 col-sm-12 col-xs-12">
		    				<p class="italic"><@orcid.msg 'record_corrections.more_info'/></p>
		    			</div>
	    			</div>	    		
		    		<div ng-repeat="element in currentPage.recordCorrections" class="row">
		    			<div class="col-md-3 col-sm-12 col-xs-12">
		    				<span ng-bind="element.dateCreated | date:'yyyy-MM-dd HH:mm:ss'"></span>	    				
		    			</div>
		    			<div class="col-md-8 col-sm-12 col-xs-12">
		    				<span ng-bind="element.description"></span>
		    			</div>
		    			<div class="col-md-1 col-sm-12 col-xs-12">
		    				<a ng-click="moreInfo(element)">
		    					<span class="glyphicon glyphicon-question-sign"></span>
		    				</a>
		    			</div>
		    		</div>	    		
	    		</div>	    		
	    		<div ng-show="currentPage.recordCorrections.length <= 0"> 
	    			<p class="italic"><@orcid.msg 'record_corrections.no_corrections'/></p>
	    		</div>                               
	    	</div>	    		    	
	    </div>
    </div>
</@public>