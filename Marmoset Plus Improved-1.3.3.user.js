// ==UserScript==
// @name                Marmoset Plus Improved
// @description         Improve the Marmoset user experience
// @version             1.3.3
// @include             https://marmoset.student.cs.uwaterloo.ca/*
// @grant               none
// @require             https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Loading image spinner
    var loadimg = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";

    // Simply changes the header
    function changeHeader() {
        $(".header").html("<p>Marmoset+</p>");
    }

    // Simply changes the fonts
    function changeFonts() {
        $("*").css("font-family", "helvetica");
    }

    // Modifies the index page to show us additional courses
    function manipulateIndexPage() {
        var isMainPage = window.location.href.match(/index\.jsp.*?/);
        if(!isMainPage)
            return; // We're not on the main page.

        // find courselist
        $("ul").after("<h1>Additional Courses</h1>")
        $("h1:last").after("<ul></ul>");

        // Iterate and go find courses!
        for(var i = 0; i < 31; i++) {
            var visitURL = '/view/course.jsp?coursePK=' + i;
            fetchPageAndUpdate($("ul:last"), visitURL, addCourse);
        }
    }

    function addCourse(listElem, responseText, url) {
        var coursehead = $(responseText).filter("h1").html();
        if(!coursehead)
            return;
        if(coursehead.length <= 19)
            return; // There isn't actually anything here.
        // strip tags from coursehead
        coursehead = coursehead.replace(/(<([^>]+)>)/ig,"");
        var item = '<li><a href="' + url + '">' + coursehead + '</a></li>';

        listElem.append(item);
    }

    // Contributed by Vikstrous Valarous
    function refreshProjectPage() {
        var isProjectPage = window.location.href.match(/project\.jsp.*?/);
        if(!isProjectPage)
            return;
        var testing = $("td:contains('tested yet')");
        if(testing.length > 0) {
            testing.each(function() {
                var html = '<td colspan="4"><img src="' + loadimg + '"></td>';
                $(this).replaceWith(html);
            });
            setTimeout(function(){
                window.location.reload();
            },5000);
        }
    }

    function manipulateProjectPage() {
        // If this is the main course page, insert test case columns
        var isCoursePage = window.location.href.match(/course\.jsp.*?/);
        if(!isCoursePage)
            return; // This is not the main project page.

        // Add columns for public and release test cases (removed secret)
        var submissionsColumn = $("tr > th:eq(1)");
        submissionsColumn.after("<th>Public Tests</th><th>Release Tests</th>");

        // Add loading placeholders for each row
        var rowSnap = $("tr > td:nth-child(2)");
        rowSnap.after("<td>Loading...</td><td>Loading...</td>");

        $("tr").each(function(index, row) {
            if(index == 0) // Top row, we don't want to be here
                return;
            var link = $(this).find('a:eq(1)').attr("href"); // /view/project.jsp?projectPK=396
            fetchPageAndUpdate($(this), link, modifySub);
        });

        // Contributed by Vikstrous Valarous
        // Replace the submit buttons!
        var $submits = $("a:contains('submit')");
        $submits.each(function(){
            var projectPK = $(this).attr('href').match('projectPK=([0-9]+)')[1];
            var html = '<form enctype="multipart/form-data" action="/action/SubmitProjectViaWeb" method="POST">'+
                '<input type="hidden" name="projectPK" value="' + projectPK + '" style="font-family: helvetica; ">'+
                '<input type="hidden" name="submitClientTool" value="web" style="font-family: helvetica; ">'+
                '<input type="file" name="file" size="20" style="font-family: helvetica; ">'+
                '<input type="submit" value="Submit project!" style="font-family: helvetica; ">'+
                '</form>';
            $(this).replaceWith(html);
        });
    }

    // This function takes an element to write the last submission info into
    // and the url of the question to go look at
    // This is for wrapping ajax calls
    function fetchPageAndUpdate(updateElem, pageurl, receiver) {
        $.ajax({
            url: pageurl,
            cache: false
        }).done(function( html ) {
            receiver(updateElem, html, pageurl);
        });
    }

    function modifySub(lastSub, responsetext, url) {
        var publicCell = lastSub.find("td:eq(2)"); // Public Tests
        var releaseCell = lastSub.find("td:eq(3)"); // Release Tests

        // Extract test results from the project page
        var tableRows = $(responsetext).find("table tr");

        // Initialize scores
        var publicScore = "N/A";
        var releaseScore = "N/A";

        // Look for different test categories in the table
        tableRows.each(function(index) {
            var rowText = $(this).text();

            if (rowText.includes("Public tests")) {
                var matches = rowText.match(/(\d+)\s*\/\s*(\d+)/);
                if (matches) {
                    publicScore = matches[1] + " / " + matches[2];
                }
            }
            else if (rowText.includes("Release tests")) {
                var matches = rowText.match(/(\d+)\s*\/\s*(\d+)/);
                if (matches) {
                    releaseScore = matches[1] + " / " + matches[2];
                }
            }
            // Some marmoset versions use different naming
            else if (rowText.includes("Basic tests") && publicScore === "N/A") {
                var matches = rowText.match(/(\d+)\s*\/\s*(\d+)/);
                if (matches) {
                    publicScore = matches[1] + " / " + matches[2];
                }
            }
            else if (rowText.includes("Additional tests") && releaseScore === "N/A") {
                var matches = rowText.match(/(\d+)\s*\/\s*(\d+)/);
                if (matches) {
                    releaseScore = matches[1] + " / " + matches[2];
                }
            }
        });

        // Fallback: if we didn't find categorized tests, try to parse the traditional way
        if (publicScore === "N/A") {
            var AllSlashes = $(responsetext).find("tr:eq(1) > td:contains('/')");
            if (AllSlashes.length >= 1) {
                var matches = $(AllSlashes[0]).html().match(/(\d+)\s*\/\s*(\d+)/);
                if (matches) publicScore = matches[1] + " / " + matches[2];
            }
            if (AllSlashes.length >= 2) {
                var matches = $(AllSlashes[1]).html().match(/(\d+)\s*\/\s*(\d+)/);
                if (matches) releaseScore = matches[1] + " / " + matches[2];
            }
        }

        // Update the cells
        publicCell.html(publicScore);
        releaseCell.html(releaseScore);
    }

    // Wait for the page to load before executing
    $(document).ready(function() {
        console.log('Marmoset+ loaded successfully');
        changeHeader();
        changeFonts();
        manipulateProjectPage();
        manipulateIndexPage();
        refreshProjectPage();
    });

})();