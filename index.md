---
layout: default
---

<div id="projects" class="container">
  <div class="row">
    <div class="col-sm">
        <a class="project" id="project-rs" href="https://rstest.weirdgloop.org/" data-toggle="tooltip" data-placement="top" title="RuneScape Wiki" >
            <div class="logo"></div>
        </a>
    </div>
    <div class="col-sm">
        <a class="project" id="project-osrs" href="https://osrstest.weirdgloop.org/" data-toggle="tooltip" data-placement="top" title="Old School RuneScape Wiki">
            <div class="logo"></div>
        </a>
    </div>
    <div class="col-sm">
        <a class="project" id="project-meta" href="http://meta.weirdgloop.org" data-toggle="tooltip" data-placement="top" title="Meta Weird Gloop">
            <div class="logo"></div>
        </a>
    </div>
  </div>
</div>

<div id="posts">
    <div class="row">
        {% for post in site.posts limit:2 %}
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{post.title}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Post &#8226; {{ post.date | date: "%-d %B %Y" }}</h6>
                    <p class="card-text">{{post.excerpt | strip_html | truncatewords:20}}</p>
                    <a href="{{post.url}}" class="card-link">Read post</a>
                </div>
            </div>
        </div>
        {% endfor %}
    </div>
</div>