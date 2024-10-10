---
title: Blog
description: Blog posts by the Weird Gloop team.
permalink: /blog/
---

# Blog

{% if site.posts.size > 0 %}
<div class="posts all-posts-list">
    <div class="row" style="gap: 1em;">
        {% for post in site.posts %}
        <div class="post-col">
            <a href="{{post.url}}" class="card text-white">
                <div class="card-body">
                    <h5 class="card-title">{{post.title}}</h5>
                    <h6 class="card-subtitle">{% if post.author %}{{ post.author }} &#8226; {% endif %}{{ post.date | date: "%-d %B %Y" }}</h6>
                    <p>{{ post.excerpt | strip_html | newline_to_br }}</p>
                </div>
                {% if post.featured_image %}
                <div class="card-img">
                    <img src="/images/posts/{{post.featured_image}}" alt="image" />
                </div>
                {% endif %}
            </a>
        </div>
        {% endfor %}
    </div>
</div>
{% else %}
There aren't any blog posts yet, check back soon!
{% endif %}
