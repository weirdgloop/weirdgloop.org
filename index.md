---
layout: default
no_parent_wrapper: true
---
<div style="margin: auto;">
    <div class="row home-row">
        <div id="projects">
            <div class="project-row">
                <div class="project">
                    <a id="project-rs" href="https://runescape.wiki/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-osrs" href="https://oldschool.runescape.wiki/">
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-rsc" href="https://classic.runescape.wiki/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-mc" href="https://minecraft.wiki/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-lol" href="https://wiki.leagueoflegends.com/en-us/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-2xko" href="https://wiki.play2xko.com/en-us/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-wf" href="https://wiki.warframe.com/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-vs" href="https://vampire.survivors.wiki/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-balatro" href="https://balatrowiki.org/" >
                        <div class="logo"></div>
                    </a>
                </div>
                <div class="project">
                    <a id="project-smite2" href="https://wiki.smite2.com/" >
                        <div class="logo"></div>
                    </a>
                </div>
            </div>
        </div>
        <div class="blog-container">
            <div style="display: flex; align-items: center; margin-bottom: 1em; gap: 1em; justify-content: space-between">
                <h2 style="font-size: 1em; font-weight: bold; margin: 0; color: #afafaf;">Blog</h2>
                <a href="/blog/" class="blog-all-posts">
                    View all
                </a>
            </div>
            {% if site.posts.size > 0 %}
            <div id="posts">
                <div class="row" style="flex-direction: column; gap: 5px;">
                    {% for post in site.posts limit:3 %}
                    <div class="post-col">
                        <a href="{{post.url}}" class="card text-white">
                            <div class="card-header">
                                <h5 class="card-title">{{post.title}}</h5>
                                <h6 class="card-subtitle">{% if post.author %}{{ post.author }} &#8226; {% endif %}{{ post.date | date: "%-d %B %Y" }}</h6>
                            </div>
                            <div class="card-body">
                                {% if forloop.index == 1 %}
                                <p>{{ post.excerpt | strip_html | newline_to_br }}</p>
                                {% endif %}
                            </div>
                            <div class="card-button">
                                Read more
                            </div>
                        </a>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% else %}
            <p>There aren't any blog posts yet, check back soon!</p>
            {% endif %}
        </div>
    </div>
</div>
