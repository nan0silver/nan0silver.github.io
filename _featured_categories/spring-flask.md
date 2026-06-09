---
# Featured tags need to have either the `list` or `grid` layout (PRO only).
layout: list

# The title of the tag's page.
title: Spring & Flask

# The name of the tag, used in a post's front matter (e.g. tags: [<slug>]).
slug: spring-flask

# (Optional) Write a short (~150 characters) description of this featured tag.
description: >
  Spring(Java)과 Flask(Python) 백엔드 프레임워크 공부 기록입니다.

# (Optional) You can disable grouping posts by date.
# no_groups: true

# Exclude this example category from the sitemap.
# DON'T USE THIS SETTING IN YOUR CATEGORIES!
sitemap: false
redirect_from:
  - /spring/
  - /flask/
---

{% for post in site['spring-flask'] %}

  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt }}</p>
{% endfor %}
