"""
Enhanced Document Processor
Optimized for speed using PyMuPDF and efficient chunking
"""
import fitz  # PyMuPDF - Much faster than pypdf
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Tuple
import logging
from pathlib import Path

from ..config import config

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """
    Fast PDF processing with PyMuPDF and optimized chunking.
    """
    
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.CHUNK_SIZE,
            chunk_overlap=config.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict[str, any]]:
        """
        Extract text from PDF using PyMuPDF (fast).
        Falls back to OCR if needed.
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            List of page dictionaries with text and page numbers
        """
        logger.info(f"Extracting text from: {pdf_path}")
        pages = []
        
        try:
            # Use PyMuPDF (much faster than pypdf)
            doc = fitz.open(pdf_path)
            
            for page_num, page in enumerate(doc, start=1):
                text = page.get_text()
                
                # Check if text extraction worked
                if len(text.strip()) < 50:
                    if config.OCR_FALLBACK:
                        logger.warning(f"Page {page_num} has minimal text, trying OCR")
                        text = self._ocr_page(pdf_path, page_num)
                    else:
                        logger.warning(f"Page {page_num} has minimal text, OCR disabled (OCR_FALLBACK=False)")
                
                pages.append({
                    "page_number": page_num,
                    "text": text.strip()
                })
                
                if page_num >= config.MAX_PAGES:
                    logger.warning(f"Reached max pages limit: {config.MAX_PAGES}")
                    break
            
            doc.close()
            logger.info(f"Extracted {len(pages)} pages")
            return pages
            
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            raise
    
    def _ocr_page(self, pdf_path: str, page_num: int) -> str:
        """
        OCR a specific page using Tesseract.
        
        Args:
            pdf_path: Path to PDF
            page_num: Page number to OCR (1-indexed)
            
        Returns:
            Extracted text
        """
        try:
            # Convert PDF page to image
            images = convert_from_path(
                pdf_path,
                first_page=page_num,
                last_page=page_num,
                dpi=200  # Balance between quality and speed
            )
            
            if images:
                # Run OCR
                text = pytesseract.image_to_string(images[0], lang='eng')
                return text.strip()
            
            return ""
            
        except Exception as e:
            logger.error(f"OCR failed for page {page_num}: {e}")
            return ""
    
    def chunk_pages(
        self, 
        pages: List[Dict[str, any]]
    ) -> List[Dict[str, any]]:
        """
        Split pages into chunks efficiently.
        
        Args:
            pages: List of page dictionaries
            
        Returns:
            List of chunk dictionaries with metadata
        """
        logger.info(f"Chunking {len(pages)} pages")
        chunks = []
        chunk_index = 0
        
        for page in pages:
            if not page["text"].strip():
                continue
            
            # Split page into chunks
            page_chunks = self.text_splitter.split_text(page["text"])
            
            for chunk_text in page_chunks:
                chunks.append({
                    "text": chunk_text,
                    "page_number": page["page_number"],
                    "chunk_index": chunk_index,
                    "token_count": len(chunk_text.split())  # Rough estimate
                })
                chunk_index += 1
        
        logger.info(f"Created {len(chunks)} chunks")
        return chunks
    
    def process_pdf(self, pdf_path: str) -> Tuple[List[Dict], int]:
        """
        Complete PDF processing pipeline.
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Tuple of (chunks, page_count)
        """
        # Extract text
        pages = self.extract_text_from_pdf(pdf_path)
        page_count = len(pages)
        
        # Chunk text
        chunks = self.chunk_pages(pages)
        
        return chunks, page_count
    
    @staticmethod
    def validate_pdf(pdf_path: str) -> Tuple[bool, str]:
        """
        Validate PDF file.
        
        Returns:
            (is_valid, error_message)
        """
        path = Path(pdf_path)
        
        if not path.exists():
            return False, "File does not exist"
        
        if not path.suffix.lower() == '.pdf':
            return False, "File is not a PDF"
        
        # Check file size (50MB limit)
        size_mb = path.stat().st_size / (1024 * 1024)
        if size_mb > 50:
            return False, f"File too large: {size_mb:.1f}MB (max 50MB)"
        
        # Try to open with PyMuPDF
        try:
            doc = fitz.open(pdf_path)
            if len(doc) == 0:
                return False, "PDF has no pages"
            doc.close()
        except Exception as e:
            return False, f"Invalid PDF: {str(e)}"
        
        return True, ""


# Global instance
document_processor = DocumentProcessor()
