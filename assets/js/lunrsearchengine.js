---
layout: null
sitemap: false
---

{% assign counter = 0 %}
var documents = [{% for page in site.pages %}{% if page.url contains '.xml' or page.url contains 'assets' or page.url contains 'category' or page.url contains 'tag' %}{% else %}{
    "id": {{ counter }},
    "url": "{{ site.url }}{{site.baseurl}}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '3>', ': ' | replace: '4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}"{% assign counter = counter | plus: 1 %}
    }, {% endif %}{% endfor %}{% for page in site.without-plugin %}{
    "id": {{ counter }},
    "url": "{{ site.url }}{{site.baseurl}}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '3>', ': ' | replace: '4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}"{% assign counter = counter | plus: 1 %}
    }, {% endfor %}{% for page in site.posts %}{
    "id": {{ counter }},
    "url": "{{ site.url }}{{site.baseurl}}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.date | date: "%Y/%m/%d" }} - {{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '3>', ': ' | replace: '4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}"{% assign counter = counter | plus: 1 %}
    }{% if forloop.last %}{% else %}, {% endif %}{% endfor %}];

var idx = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('body');

    documents.forEach(function (doc) {
        this.add(doc);
    }, this);
});

function lunr_search(term) {
    var $container = $('#lunrsearchresults');
    if (!term || !term.trim()) {
        $container.fadeOut(150);
        return false;
    }
    
    var html = '<div class="search-modal-card">';
    html += '<div class="search-modal-header">';
    html += '<span class="search-modal-title">Results for &ldquo;' + term + '&rdquo;</span>';
    html += '<button type="button" class="search-modal-close" id="btnx" aria-label="Close">&times;</button>';
    html += '</div>';
    html += '<div class="search-modal-body"><ul>';
    
    var results = idx.search(term);
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            var ref = results[i]['ref'];
            var url = documents[ref]['url'];
            var title = documents[ref]['title'];
            var body = documents[ref]['body'].substring(0, 110) + '...';
            html += "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><span class='body'>" + body + "</span></a></li>";
        }
    } else {
        html += "<li class='search-no-results'>No articles found matching &ldquo;" + term + "&rdquo;.</li>";
    }
    
    html += '</ul></div></div>';
    $container.html(html).fadeIn(150);
    return false;
}

$(document).ready(function() {
    function closeSearch() {
        $('#lunrsearchresults').fadeOut(150);
    }

    // Real-time search on typing or focusing with query
    $('#lunrsearch').on('keyup input focus', function() {
        var query = $(this).val();
        if (query && query.trim().length >= 2) {
            lunr_search(query);
        } else if (!query || query.trim().length === 0) {
            closeSearch();
        }
    });

    // Close on X button click
    $(document).on('click', '#btnx', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
    });

    // Close on click / mousedown / touchstart anywhere outside #snapsec-search-wrapper
    $(document).on('click mousedown touchstart', function(e) {
        if (!$(e.target).closest('#snapsec-search-wrapper').length) {
            closeSearch();
        }
    });

    // Close on Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
});