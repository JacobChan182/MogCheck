import os
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import io

# Load environment variables from .env file
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Constants
DEFAULT_FACIAL_ANALYSIS_PROMPT = """Analyze this person's face and return a JSON object with the following exact field names and integer scores (0-10, use 101 if insufficient information):
{
  "facial_symmetry_rating": <int>,
  "facial_thirds_rating": <int>,
  "facial_growth_rating": <int>,
  "fWHR_rating": <int>,
  "sharpness_rating": <int>,
  "gonial_angle_rating": <int>,
  "chin_projection_rating": <int>,
  "chin_alignment_rating": <int>,
  "mandible_width_rating": <int>,
  "ramus_height_rating": <int>,
  "cheekbone_height_rating": <int>,
  "cheekbone_width_rating": <int>,
  "hollow_cheek_rating": <int>,
  "midface_length_rating": <int>,
  "maxillary_projection_rating": <int>,
  "under_eye_support_rating": <int>,
  "canthal_tilt_rating": <int>,
  "eye_setness_rating": <int>,
  "eye_spacing_rating": <int>,
  "brow_position_rating": <int>,
  "brow_arch_rating": <int>,
  "forehead_smoothness_rating": <int>,
  "forehead_height_rating": <int>,
  "brow_symmetry_rating": <int>,
  "nasal_bridge_straightness_rating": <int>,
  "radix_height_rating": <int>,
  "nasal_projection_rating": <int>,
  "dorsal_hump_rating": <int>,
  "lip_to_chin_rating": <int>,
  "cupid_bow_rating": <int>,
  "maxilla_support_rating": <int>,
  "skin_tightness_rating": <int>,
  "facial_fat_rating": <int>,
  "skin_texture_rating": <int>,
  "eyebag_rating": <int>,
  "facial_convexity_rating": <int>,
  "nose_lip_chin_harmony_rating": <int>,
  "jaw_recession_rating": <int>,
  "cervicomental_angle_rating": <int>

  RATING CALIBRATION:

  0–49: Underdeveloped, recessed, asymmetrical, unremarkable, undesirable, or structurally poor
  50: Slightly above average, typical population mean
  51–99: Highly above average, clearly favorable
  100: Rare, textbook ideal

  Symmetry-based traits:
  - 100 = perfect bilateral symmetry
  - 50 = low asymmetry
  - 0 = severe asymmetry

  Projection-based traits:
  - 100 = strong, proportional forward projection
  - 50 = neutral
  - 0 = severely recessed

  Width-based traits:
  - 100 = extremely desirable width
  - 50 = unremarkable width
  - 0 = narrow or excessively disproportionate

  Soft tissue traits:
  - 100 = tight, smooth, youthful
  - 50 = normal
  - 0 = loose, sagging, excessive wrinkles,or pronounced irregularities

}

Return ONLY valid JSON, no additional text or explanation."""
SYSTEM_INSTRUCTION = """You are a brutally honest critical facial feature analysis model, who gives low scores on the facial features that the person can improve.

Your task is to analyze a single frontal and/or profile facial image and assign numerical ratings (0–100) to specific anatomical and aesthetic features.

IMPORTANT RULES:
- Ratings reflect common contemporary facial aesthetic standards used in computer vision and facial morphology analysis.
- 0 = extremely undesirable or severely deficient relative to the trait
- 50 = average / unremarkable
- 100 = extremely desirable / ideal expression of the trait
- If a feature cannot be reliably assessed, assign an 101.
- Be internally consistent across all features."""

# Initialize model if API key is available
model = None
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel("gemma-3-27b-it")

def _validate_model():
    """Validate that the model is initialized."""
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in your .env file.")
    if model is None:
        raise ValueError("Gemini model not initialized. Please check your GOOGLE_API_KEY.")


def _clean_markdown(text: str) -> str:
    """Remove markdown code block formatting from text."""
    if text.startswith("```json"):
        return text.replace("```json", "").replace("```", "").strip()
    elif text.startswith("```"):
        return text.replace("```", "").strip()
    return text


def generate_text(prompt: str) -> str:
    """Generate text using Gemini model."""
    _validate_model()
    
    try:
        response = model.generate_content(prompt)
        return _clean_markdown(response.text)
    except Exception as e:
        raise Exception(f"Error generating content: {str(e)}")

def generate_from_image(image_data: bytes, prompt: str = DEFAULT_FACIAL_ANALYSIS_PROMPT) -> str:
    """Analyze facial features from an image using Gemini Vision API and return JSON ratings."""
    _validate_model()
    
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Prepend system instruction to the prompt
        full_prompt = f"{SYSTEM_INSTRUCTION}\n\n{prompt}"
        
        # Generate content from image with prompt
        response = model.generate_content([full_prompt, image])
        
        return _clean_markdown(response.text)
    except Exception as e:
        raise Exception(f"Error generating content from image: {str(e)}")