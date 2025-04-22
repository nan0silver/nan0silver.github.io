---
# Featured tags need to have either the `list` or `grid` layout (PRO only).
layout: list

# The title of the tag's page.
title: ProjectDiary

# The name of the tag, used in a post's front matter (e.g. tags: [<slug>]).
slug: project_diary

# (Optional) Write a short (~150 characters) description of this featured tag.
description: >
  프로젝틑를 하면서 겪은 문제상황 및 회고를 정리합니다.

# (Optional) You can disable grouping posts by date.
# no_groups: true

# Exclude this example category from the sitemap.
# DON'T USE THIS SETTING IN YOUR CATEGORIES!
sitemap: false
---

{% for post in site.project_diary %}

  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt }}</p>
{% endfor %}
