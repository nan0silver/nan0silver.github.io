---
# Featured tags need to have either the `list` or `grid` layout (PRO only).
layout: list

# The title of the tag's page.
title: Miscellaneous

# The name of the tag, used in a post's front matter (e.g. tags: [<slug>]).
slug: miscellaneous

# (Optional) Write a short (~150 characters) description of this featured tag.
description: >
  Miscellaneous : 여러 가지 잡다한  <br>
  위의 카테고리 외의 다양한 주제를 다루는 공간입니다.
  깊이 있는 기술적 주제부터 광범위한 아이디어까지, 폭넓은 내용을 포함합니다.

# (Optional) You can disable grouping posts by date.
# no_groups: true

# Exclude this example category from the sitemap.
# DON'T USE THIS SETTING IN YOUR CATEGORIES!
sitemap: false
---

{% for post in site.aws %}

  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt }}</p>
{% endfor %}
