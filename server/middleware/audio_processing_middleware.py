# # compress_audio.py

# import os
# import subprocess
# import argparse


# def compress_audio(input_file, output_file, bitrate="128k"):
#     """
#     Compresses the input audio file using FFmpeg.

#     Args:
#     - input_file: Path to the input audio file.
#     - output_file: Path to save the compressed audio file.
#     - bitrate: Desired bitrate for the compressed audio (default is '128k').
#     """
#     try:
#         # Create the output directory if it does not exist
#         os.makedirs(os.path.dirname(output_file), exist_ok=True)

#         # Run FFmpeg command to compress audio
#         subprocess.run(
#             ["ffmpeg", "-i", input_file, "-b:a", bitrate, output_file], check=True
#         )
#         print("Audio compression successful.")
#     except subprocess.CalledProcessError as e:
#         print("Error compressing audio:", e)
#         raise e


# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="Compress an audio file.")
#     parser.add_argument("input_file", type=str, help="Path to the input audio file")
#     parser.add_argument(
#         "output_file", type=str, help="Path to save the compressed audio file"
#     )
#     parser.add_argument(
#         "--bitrate",
#         type=str,
#         default="256k",
#         help="Desired bitrate for the compressed audio (default is '256k')",
#     )
#     args = parser.parse_args()

#     print("Python script started")
#     compress_audio(args.input_file, args.output_file, args.bitrate)
