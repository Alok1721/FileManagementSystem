import pdfplumber
from PIL import Image
import io
import easyocr

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])  # Specify the language(s)

def extract_text_from_pdf(file):
    try:
        with pdfplumber.open(file) as pdf:
            text = ""
            for page in pdf.pages:
                print(f"Processing page {page.page_number}...")
                if(page.page_number >5):
                    continue
                # Extract text directly from the page (if any)
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                
                # Check if the page contains images
                if page.images:
                    for img in page.images:
                        try:
                            # Extract the image from the page
                            img_obj = img['stream']
                            img_data = img_obj.get_data()  # Extract raw image data
                            pil_image = Image.open(io.BytesIO(img_data))
                            
                            # Perform OCR on the image using EasyOCR
                            results = reader.readtext(pil_image)
                            for result in results:
                                text += result[1] + "\n"  # Append the detected text
                        except Exception as img_error:
                            print(f"Error processing image on page {page.page_number}: {img_error}")
        
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""  # Return empty string if error occurs

# Example usage
pdf_text = extract_text_from_pdf('ApiServices/dig.pdf')
print(pdf_text)