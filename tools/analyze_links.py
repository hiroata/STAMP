#!/usr/bin/env python3
"""
HTML Link Analysis Script
Analyzes all HTML files in the STAMP directory and checks for broken links.
"""

import os
import re
from pathlib import Path
from urllib.parse import urlparse
import json

def extract_href_links(html_content):
    """Extract all href links from HTML content"""
    pattern = r'href=["\'](.*?)["\']'
    links = re.findall(pattern, html_content, re.IGNORECASE)
    return links

def is_external_link(link):
    """Check if a link is external (starts with http/https)"""
    return link.startswith('http://') or link.startswith('https://')

def normalize_path(link, base_dir):
    """Normalize relative paths to absolute paths"""
    if is_external_link(link):
        return link
    
    # Handle anchor links, mailto, tel, etc.
    if link.startswith('#') or link.startswith('mailto:') or link.startswith('tel:'):
        return link
    
    # Handle query parameters
    if '?' in link:
        link = link.split('?')[0]
    
    # Convert to absolute path
    if link.startswith('/'):
        return os.path.join(base_dir, link.lstrip('/'))
    else:
        return os.path.join(base_dir, link)

def analyze_html_files(base_dir):
    """Analyze all HTML files in the directory"""
    results = {
        'files_analyzed': [],
        'working_links': [],
        'broken_links': [],
        'external_links': [],
        'special_links': [],  # mailto, tel, anchors
        'summary': {}
    }
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk(base_dir):
        # Skip certain directories
        skip_dirs = ['node_modules', 'generated', 'backup', 'stamp-next', '.git']
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    # Analyze each file
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            links = extract_href_links(content)
            file_relative = os.path.relpath(file_path, base_dir)
            
            file_info = {
                'file': file_relative,
                'links': []
            }
            
            for link in links:
                link_info = {
                    'href': link,
                    'type': '',
                    'exists': False,
                    'target_path': ''
                }
                
                if is_external_link(link):
                    link_info['type'] = 'external'
                    link_info['exists'] = True  # We assume external links exist
                    results['external_links'].append({
                        'file': file_relative,
                        'link': link
                    })
                elif link.startswith('#') or link.startswith('mailto:') or link.startswith('tel:'):
                    link_info['type'] = 'special'
                    link_info['exists'] = True  # Special links are valid
                    results['special_links'].append({
                        'file': file_relative,
                        'link': link
                    })
                else:
                    # Internal file link
                    link_info['type'] = 'internal'
                    target_path = normalize_path(link, base_dir)
                    link_info['target_path'] = target_path
                    
                    # Check if target file exists
                    if os.path.exists(target_path):
                        link_info['exists'] = True
                        results['working_links'].append({
                            'file': file_relative,
                            'link': link,
                            'target': os.path.relpath(target_path, base_dir)
                        })
                    else:
                        link_info['exists'] = False
                        results['broken_links'].append({
                            'file': file_relative,
                            'link': link,
                            'target': os.path.relpath(target_path, base_dir) if target_path else link
                        })
                
                file_info['links'].append(link_info)
            
            results['files_analyzed'].append(file_info)
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    
    # Generate summary
    results['summary'] = {
        'total_files': len(results['files_analyzed']),
        'total_links': len(results['working_links']) + len(results['broken_links']) + len(results['external_links']) + len(results['special_links']),
        'working_links': len(results['working_links']),
        'broken_links': len(results['broken_links']),
        'external_links': len(results['external_links']),
        'special_links': len(results['special_links'])
    }
    
    return results

def main():
    base_dir = '/mnt/c/Users/atara/Desktop/STAMP'
    
    print("Analyzing HTML files and their links...")
    results = analyze_html_files(base_dir)
    
    # Print summary
    print("\n=== LINK ANALYSIS SUMMARY ===")
    print(f"Files analyzed: {results['summary']['total_files']}")
    print(f"Total links found: {results['summary']['total_links']}")
    print(f"Working internal links: {results['summary']['working_links']}")
    print(f"Broken internal links: {results['summary']['broken_links']}")
    print(f"External links: {results['summary']['external_links']}")
    print(f"Special links (anchors, mailto, tel): {results['summary']['special_links']}")
    
    # Print broken links
    if results['broken_links']:
        print("\n=== BROKEN LINKS ===")
        for broken in results['broken_links']:
            print(f"File: {broken['file']}")
            print(f"  Link: {broken['link']}")
            print(f"  Target: {broken['target']}")
            print()
    
    # Print working links grouped by target
    print("\n=== WORKING INTERNAL LINKS ===")
    working_by_target = {}
    for working in results['working_links']:
        target = working['target']
        if target not in working_by_target:
            working_by_target[target] = []
        working_by_target[target].append(working['file'])
    
    for target, files in sorted(working_by_target.items()):
        print(f"Target: {target}")
        for file in files:
            print(f"  Referenced by: {file}")
        print()
    
    # Print external links
    if results['external_links']:
        print("\n=== EXTERNAL LINKS ===")
        for external in results['external_links']:
            print(f"File: {external['file']}")
            print(f"  Link: {external['link']}")
        print()
    
    # Save detailed results to JSON
    output_file = os.path.join(base_dir, 'link_analysis_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\nDetailed results saved to: {output_file}")

if __name__ == "__main__":
    main()