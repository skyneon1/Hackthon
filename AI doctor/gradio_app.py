# VoiceBot UI with Gradio
import os
import gradio as gr
import time

from brain_of_the_doctor import encode_image, analyze_image_with_query
from voice_of_the_patient import transcribe_with_groq

# Set API key directly
GROQ_API_KEY = "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"

def process_inputs(audio, image, text):
    try:
        # Initialize response
        query = ""
        response = ""

        # Process text or audio input
        if text:
            query = text
            print(f"Using text input: {text}")
        elif audio is not None:
            try:
                print(f"Processing audio input...")
                query = transcribe_with_groq(
                    GROQ_API_KEY=GROQ_API_KEY,
                    audio_filepath=audio,
                    stt_model="whisper-large-v3"
                )
                print(f"Transcribed text: {query}")
            except Exception as e:
                print(f"Audio error: {str(e)}")
                return "", "Error processing audio. Please try again."

        # Process image
        if image is not None:
            try:
                print(f"Processing image...")
                prompt = f"You are a medical doctor. Analyze this image and explain what you see. If the patient asks: {query}"
                response = analyze_image_with_query(
                    query=prompt,
                    encoded_image=encode_image(image),
                    model="llama-3.2-11b-vision-preview"
                )
                print(f"AI response: {response}")
            except Exception as e:
                print(f"Image error: {str(e)}")
                return query, "Error analyzing image. Please try again."
        else:
            return query, "Please provide a medical image to analyze."

        return query, response

    except Exception as e:
        print(f"General error: {str(e)}")
        return "", f"An error occurred: {str(e)}"

# Create interface
demo = gr.Interface(
    fn=process_inputs,
    inputs=[
        gr.Audio(sources=["microphone"], type="filepath"),
        gr.Image(type="filepath"),
        gr.Textbox(placeholder="Type your question here (optional)")
    ],
    outputs=[
        gr.Textbox(label="Your Question"),
        gr.Textbox(label="Doctor's Response")
    ],
    title="AI Medical Assistant",
    description="Upload a medical image and optionally provide voice/text input for analysis."
)

# Launch with basic configuration
if __name__ == "__main__":
    demo.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False
    )