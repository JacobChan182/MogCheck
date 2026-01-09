from typing import Optional
import json
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gemini_api import generate_from_image

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptResponse(BaseModel):

    # Facial Framework Ratings
    facial_symmetry_rating: int
    facial_thirds_rating: int
    facial_growth_rating: int
    fWHR_rating: int

    # Jawline Ratings
    sharpness_rating: int
    gonial_angle_rating: int

    # Chin
    chin_projection_rating: int
    chin_alignment_rating: int

    # Mandible Ratings
    mandible_width_rating: int
    ramus_height_rating: int

    # Cheekbone Ratings
    cheekbone_height_rating: int
    cheekbone_width_rating: int
    hollow_cheek_rating: int

    # Midface Ratings
    midface_length_rating: int
    maxillary_projection_rating: int
    under_eye_support_rating: int

    # Eye Ratings
    canthal_tilt_rating: int
    eye_setness_rating: int
    eye_spacing_rating: int

    # Brow/Forehead Ratings
    brow_position_rating: int
    brow_arch_rating: int
    forehead_smoothness_rating: int
    forehead_height_rating: int
    brow_symmetry_rating: int

    # Nasal Bone Structure Ratings
    nasal_bridge_straightness_rating: int
    radix_height_rating: int
    nasal_projection_rating: int
    dorsal_hump_rating: int

    # Lip/Perioral Area
    lip_to_chin_rating: int
    cupid_bow_rating: int
    maxilla_support_rating: int

    # Skin Rating
    skin_tightness_rating: int
    facial_fat_rating: int
    skin_texture_rating: int
    eyebag_rating: int

    # Profile View
    facial_convexity_rating: int
    nose_lip_chin_harmony_rating: int
    jaw_recession_rating: int
    cervicomental_angle_rating: int


@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/api/gemini/", response_model=PromptResponse)
async def generate_gemini_response(
    image: UploadFile = File(...),
    prompt: Optional[str] = Form(None)
):
    """Analyze facial features from an uploaded image and return structured ratings."""
    try:
        # Validate file type
        if not image.content_type or not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await image.read()
        
        if not image_data:
            raise HTTPException(status_code=400, detail="Image file is empty")
        
        # Generate response from image (uses default facial analysis prompt if none provided)
        response_text = generate_from_image(image_data, prompt) if prompt else generate_from_image(image_data)
        
        # Parse JSON response and map to PromptResponse
        try:
            response_data = json.loads(response_text)
            
            # Validate that all required fields are present
            required_fields = [
                'facial_symmetry_rating', 'facial_thirds_rating', 'facial_growth_rating', 'fWHR_rating',
                'sharpness_rating', 'gonial_angle_rating',
                'chin_projection_rating', 'chin_alignment_rating',
                'mandible_width_rating', 'ramus_height_rating',
                'cheekbone_height_rating', 'cheekbone_width_rating', 'hollow_cheek_rating',
                'midface_length_rating', 'maxillary_projection_rating', 'under_eye_support_rating',
                'canthal_tilt_rating', 'eye_setness_rating', 'eye_spacing_rating',
                'brow_position_rating', 'brow_arch_rating', 'forehead_smoothness_rating',
                'forehead_height_rating', 'brow_symmetry_rating',
                'nasal_bridge_straightness_rating', 'radix_height_rating', 'nasal_projection_rating', 'dorsal_hump_rating',
                'lip_to_chin_rating', 'cupid_bow_rating', 'maxilla_support_rating',
                'skin_tightness_rating', 'facial_fat_rating', 'skin_texture_rating', 'eyebag_rating',
                'facial_convexity_rating', 'nose_lip_chin_harmony_rating', 'jaw_recession_rating', 'cervicomental_angle_rating'
            ]
            
            missing_fields = [field for field in required_fields if field not in response_data]
            if missing_fields:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Missing required fields in response: {', '.join(missing_fields[:5])}{'...' if len(missing_fields) > 5 else ''}. "
                           f"Response keys: {list(response_data.keys())[:10]}"
                )
            
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse JSON response: {str(e)}. Response: {response_text[:200]}")
        
        return PromptResponse(**response_data)
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")
