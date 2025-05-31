import os
from google import genai
from google.generai import types
from google.generai.types import HarmCategory, HarmBlockThreshold

# --- IMPORTANT: Configure your API key ---
# Make sure your GOOGLE_API_KEY environment variable is set.
# For example, in your terminal: export GOOGLE_API_KEY="YOUR_API_KEY"
# Or, uncomment and use the line below (less secure for shared code):
# genai.configure(api_key="YOUR_API_KEY_HERE")

if not os.getenv('GOOGLE_API_KEY'):
    try:
        # Try to get it from input if not set (for easier Colab/local testing)
        api_key_input = input("Please enter your GOOGLE_API_KEY: ")
        if api_key_input:
            genai.configure(api_key=api_key_input)
        else:
            print("API key not provided. Please set the GOOGLE_API_KEY environment variable.")
            exit()
    except Exception as e:
        print(f"Error during API key input: {e}")
        print("Please set the GOOGLE_API_KEY environment variable.")
        exit()
else:
    genai.configure(api_key=os.environ['GOOGLE_API_KEY'])


# Use GenerativeModel for newer models and features
# Using gemini-1.5-flash-latest which is fast and supports tool use well
try:
    client = genai.GenerativeModel(
        model_name="gemini-1.5-flash-latest",
        tools=[types.Tool(code_execution=types.ToolCodeExecution())],
        # Optional: Adjust safety settings if needed, e.g., for code generation
        safety_settings={
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
    )

    # Start a chat session
    chat = client.start_chat(history=[]) # history=[] for a new chat

    print("--- Initial Bot Greeting (if any) ---")
    response = chat.send_message("I have a math question for you.")
    # The first response might just be an acknowledgment
    if response.candidates and response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            if part.text:
                print(f"Bot: {part.text}")
    print("-" * 30)


    print("\n--- Asking the Prime Sum Question ---")
    prompt_message = (
        "What is the sum of the first 50 prime numbers? "
        "Generate and run Python code for the calculation, and make sure you get all 50. "
        "Then tell me the final sum."
    )
    response = chat.send_message(prompt_message)

    print("\n--- Response Breakdown ---")
    if response.candidates and response.candidates[0].content and response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            print("-" * 10) # Part separator
            if hasattr(part, 'text') and part.text:
                print(f"Text Part: {part.text.strip()}")
            if hasattr(part, 'executable_code') and part.executable_code:
                print(f"Executable Code Part:\n```python\n{part.executable_code.code.strip()}\n```")
            if hasattr(part, 'code_execution_result') and part.code_execution_result:
                # The API automatically executes the code if an ExecutableCode part is returned
                # and a CodeExecutionResult part follows it.
                print(f"Code Execution Result Output:\n{part.code_execution_result.output.strip()}")
    else:
        print("No valid response or parts found.")
        if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
            print(f"Prompt Feedback: {response.prompt_feedback}")

    print("\n\n--- Final Chat History ---")
    for i, message in enumerate(chat.history):
        print(f"\nMessage {i+1} ({message.role}):")
        for part in message.parts:
            if hasattr(part, 'text') and part.text:
                print(f"  Text: {part.text.strip()}")
            if hasattr(part, 'executable_code') and part.executable_code:
                 print(f"  Executable Code:\n  ```python\n  {part.executable_code.code.strip()}\n  ```")
            if hasattr(part, 'code_execution_result') and part.code_execution_result:
                 print(f"  Code Execution Result Output:\n  {part.code_execution_result.output.strip()}")


except Exception as e:
    print(f"An error occurred: {e}")
    import traceback
    traceback.print_exc()