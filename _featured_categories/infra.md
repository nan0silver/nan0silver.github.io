---
layout: list

title: Infra (AWS · Git)

slug: infra

description: >
  AWS 클라우드와 Git 버전 관리 관련 공부 기록입니다.

sitemap: false
redirect_from:
  - /aws/
  - /git/
---

{% for post in site.infra %}

  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <p>{{ post.excerpt }}</p>
{% endfor %}
