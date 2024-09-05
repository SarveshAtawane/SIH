import os
import requests
import fitz  
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from pathlib import Path

base_directory = 'extracted_texts'
media_directory = 'media_files'

Path(base_directory).mkdir(parents=True, exist_ok=True)
Path(media_directory).mkdir(parents=True, exist_ok=True)

base_url = 'https://hte.rajasthan.gov.in/college/gpcajmer'
visited_urls = set()
urls_to_scrape = [base_url]

def extract_text_and_tables(soup):
    text_content = ''
    for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        text_content += tag.get_text(separator='\n', strip=True) + '\n'
    for table in soup.find_all('table'):
        text_content += '\nTable:\n'
        for row in table.find_all('tr'):
            row_data = [cell.get_text(separator=' ', strip=True) for cell in row.find_all(['td', 'th'])]
            text_content += '| ' + ' | '.join(row_data) + ' |\n'
        text_content += '\n'  
    return text_content

def download_file(url, folder):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        filename = os.path.basename(urlparse(url).path)
        file_path = os.path.join(folder, filename)
        
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        
        print(f'Downloaded {file_path}')
        if file_path.lower().endswith('.pdf'):
            extract_images_from_pdf(file_path, folder)
            os.remove(file_path) 
    
    except Exception as e:
        print(f'Failed to download {url}: {e}')

def extract_images_from_pdf(pdf_path, folder):
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            for img_index, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_filename = f"{os.path.basename(pdf_path).replace('.pdf', '')}_page_{page_num+1}_img_{img_index+1}.png"
                image_path = os.path.join(folder, image_filename)
                with open(image_path, 'wb') as img_file:
                    img_file.write(image_bytes)
                print(f'Extracted image {image_path}')
    
    except Exception as e:
        print(f'Failed to extract images from {pdf_path}: {e}')

while urls_to_scrape:
    current_url = urls_to_scrape.pop(0)
    if current_url in visited_urls:
        continue
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    response = requests.get(current_url, headers= headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    visited_urls.add(current_url)
    content = extract_text_and_tables(soup)
    file_path = os.path.join(base_directory, f'document_{len(visited_urls)}.txt')
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f'Saved {file_path}')

    for tag in soup.find_all(['img', 'a']):
        src = tag.get('src') if tag.name == 'img' else tag.get('href')
        if src:
            file_url = urljoin(base_url, src)
            if file_url.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.pdf')):
                download_file(file_url, media_directory)

    for link in soup.find_all('a', href=True):
        absolute_url = urljoin(base_url, link['href'])
        if absolute_url.startswith(base_url) and absolute_url not in visited_urls:
            urls_to_scrape.append(absolute_url)
