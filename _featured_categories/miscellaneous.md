---
layout: list

title: 기타

slug: miscellaneous

description: >
  AI, TDD, CS 등 위 카테고리에 속하지 않는 다양한 주제를 다루는 공간입니다.

sitemap: false
redirect_from:
  - /ai/
---

{% for post in site.miscellaneous %}

  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt }}</p>
{% endfor %}
