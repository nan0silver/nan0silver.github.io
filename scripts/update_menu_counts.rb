#!/usr/bin/env ruby
# frozen_string_literal: true
#
# 메뉴 항목의 게시물 수를 자동으로 계산해 _config.yml 의 menu 섹션을 갱신합니다.
# 사용법: ruby scripts/update_menu_counts.rb  (블로그 루트에서 실행)
#
# URL이 /카테고리/ 형태인 항목에 대해 해당 카테고리/_posts/ 내 .md, .markdown 파일 수로
# title 뒤의 (숫자)를 갱신합니다. About 등 _posts 가 없는 항목은 변경하지 않습니다.

CONFIG_PATH = File.expand_path('../_config.yml', __dir__)
ROOT_DIR = File.expand_path('..', __dir__)

def slug_from_url(url)
  return nil unless url.is_a?(String)
  m = url.match(%r{^/([^/]+)/?$})
  m ? m[1] : nil
end

def base_title(title)
  return title unless title.is_a?(String)
  title.sub(/\s*\(\d+\)\s*$/, '').strip
end

def count_posts(slug)
  dir = File.join(ROOT_DIR, slug, '_posts')
  return 0 unless File.directory?(dir)
  Dir.glob(File.join(dir, '*.{md,markdown}'), File::FNM_EXTGLOB).count
end

def update_menu_counts!
  content = File.read(CONFIG_PATH)
  # menu: 블록 찾기 (menu: 로 시작해 다음 최상위 키 전까지)
  menu_start = content.index(/\nmenu:\s*\n/)
  raise "menu: block not found in _config.yml" unless menu_start

  start_pos = menu_start + 1
  rest = content[start_pos..]
  # menu 블록 끝: 빈 줄 뒤에 오는 주석(#) 또는 다음 최상위 키(알파벳)
  block_end_match = rest.match(/\n\n\s*[\#a-z]/)
  end_pos = block_end_match ? start_pos + block_end_match.begin(0) : content.length
  menu_block = content[start_pos...end_pos]

  lines = menu_block.each_line.to_a
  i = 0
  new_lines = []

  while i < lines.size
    line = lines[i]
    title_match = line.match(/\A(\s*-\s*title:\s*)(.+)(\s*\n?)\z/)
    url_match = i + 1 < lines.size && lines[i + 1].match(/\A(\s*url:\s*)(.+)(\s*\n?)\z/)

    if title_match && url_match
      indent, title_value, ending = title_match[1], title_match[2].strip, title_match[3]
      url_value = url_match[2].strip
      slug = slug_from_url(url_value)
      count = slug ? count_posts(slug) : nil
      base = base_title(title_value)
      # _posts가 없거나 0개면 숫자 없이 표시 (예: About)
      new_title = count.is_a?(Integer) && count > 0 ? "#{base} (#{count})" : base
      new_lines << "#{indent}#{new_title}#{ending}"
      new_lines << lines[i + 1]
      i += 2
      next
    end

    new_lines << line
    i += 1
  end

  new_block = new_lines.join
  new_content = content[0...start_pos] + new_block + content[end_pos..]
  File.write(CONFIG_PATH, new_content)
  puts "Updated menu counts in _config.yml"
end

Dir.chdir(ROOT_DIR) do
  update_menu_counts!
end
