# AI-Assisted Calligraphy Evaluation WeChat Mini Program

An AI-assisted Chinese calligraphy evaluation system developed as an undergraduate graduation project. The project is implemented as a WeChat Mini Program and uses Tencent CloudBase, image processing techniques, and a multimodal large language model to provide calligraphy analysis and comparison.

## Overview

This project explores how computer vision techniques and multimodal large language models can be combined in an application for Chinese calligraphy practice and evaluation.

Users can browse calligraphy works, upload their own works, compare them with reference images, and obtain AI-assisted feedback.

The system mainly consists of:

* A WeChat Mini Program frontend
* Tencent CloudBase cloud functions, database, and storage
* Image-based similarity analysis
* Multimodal large language model integration through the DashScope API

## Key Features

### Calligraphy Work Management

The Mini Program provides functions for:

* User login and profile management
* Uploading calligraphy works
* Browsing uploaded works
* Browsing works by calligraphy masters
* Viewing individual works
* Rating and commenting
* Comparing user works with reference works

### AI-Assisted Calligraphy Analysis

The project integrates a multimodal Qwen model through the DashScope API.

A user can upload a calligraphy image, which is stored in Tencent CloudBase. The corresponding cloud function obtains a temporary image URL and sends the image together with task-specific prompts to the multimodal model.

The generated analysis is returned to the Mini Program and displayed to the user.

The AI-assisted analysis focuses on visual aspects such as:

* Stroke characteristics
* Character structure
* Writing style
* Overall visual characteristics

The project uses a pre-trained multimodal model rather than training a dedicated calligraphy recognition model from scratch.

### AI-Assisted Calligraphy Comparison

The system also supports comparison between a reference calligraphy work and a user's work.

Two images are downloaded from CloudBase storage and converted to Base64 data before being sent to the multimodal model. The model is prompted to compare the two works and provide a similarity assessment.

This provides a higher-level semantic comparison that complements the traditional image-processing approach.

### Image Similarity Analysis

The project also explores a traditional image-processing approach for estimating visual similarity between calligraphy images.

The processing pipeline includes:

* JPEG preprocessing
* Sampled RGB image information
* RGB histogram-style feature sampling
* Edge-based structural analysis using Sobel-like gradients
* A 64-bit perceptual hash using an average-threshold approach
* Color distance calculation
* Hamming distance calculation
* Weighted similarity calculation

A simplified representation of the pipeline is:

```text
Calligraphy Image
       │
       ▼
Image Preprocessing
       │
       ├──► RGB Information
       │
       ├──► Histogram Sampling
       │
       ├──► Edge / Structural Features
       │
       └──► Perceptual Hash
                    │
                    ▼
             Similarity Calculation
```

The image-processing approach and multimodal AI approach provide two different ways of analyzing the relationship between calligraphy images.

## System Architecture

```text
┌──────────────────────────────────┐
│       WeChat Mini Program        │
│                                  │
│  User Interface                  │
│  Login & Profile                 │
│  Work Upload & Browsing          │
│  Calligraphy Comparison          │
│  AI-Assisted Evaluation          │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│          Tencent CloudBase       │
│                                  │
│  Cloud Functions                 │
│  Cloud Storage                   │
│  Cloud Database                  │
└───────────────┬──────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌────────────────┐  ┌────────────────────┐
│ Image          │  │ Multimodal AI      │
│ Processing     │  │ Analysis           │
│                │  │                    │
│ RGB Features   │  │ Qwen               │
│ Histogram      │  │ DashScope API      │
│ Edge Analysis  │  │ Image Comparison   │
│ Perceptual Hash│  │ Calligraphy Review │
└────────────────┘  └────────────────────┘
```

## Technology Stack

### Frontend

* WeChat Mini Program
* JavaScript
* WXML
* WXSS

### Backend

* Tencent CloudBase
* Cloud Functions
* Cloud Storage
* Cloud Database
* Node.js

### Image Processing

* Jimp
* Image preprocessing
* RGB feature sampling
* Histogram-style feature extraction
* Sobel-like edge analysis
* Perceptual hashing
* Hamming distance
* Color distance

### AI

* Qwen multimodal large language model
* DashScope API
* OpenAI-compatible API interface

## Project Structure

```text
.
├── cloudfunctions/
│   ├── aliImageAnalysis/
│   │   └── # AI-assisted single-image analysis
│   │
│   ├── calligraphyCompare/
│   │   └── # AI-assisted comparison of two calligraphy works
│   │
│   └── login/
│       └── # User OpenID retrieval
│
├── miniprogram/
│   ├── pages/
│   │   ├── login/
│   │   ├── upload/
│   │   ├── display/
│   │   ├── detail/
│   │   ├── compare/
│   │   ├── evaluate/
│   │   ├── masterworks/
│   │   ├── masterdisplay/
│   │   └── ...
│   │
│   ├── components/
│   ├── images/
│   └── app.js
│
├── project.config.json
├── ccloudbaserc.json
├── .gitignore
└── README.md
```

## AI-Assisted Analysis

The AI evaluation component uses a multimodal large language model through the DashScope API.

The basic workflow is:

```text
User Selects Calligraphy Image
            │
            ▼
       Cloud Storage
            │
            ▼
       Cloud Function
            │
            ▼
   Temporary Image URL
            │
            ▼
    Qwen Multimodal Model
            │
            ▼
    Textual Evaluation
            │
            ▼
      Mini Program UI
```

Task-specific prompts are used to guide the model toward calligraphy-related visual analysis.

The project demonstrates an application-level approach to integrating multimodal AI rather than developing and training a new neural network model.

## Calligraphy Comparison

The comparison feature supports two different approaches.

### Multimodal AI Comparison

The `calligraphyCompare` cloud function retrieves two images from CloudBase storage and sends them to the multimodal model together with a comparison prompt.

The model provides a textual comparison and similarity assessment.

### Traditional Image Comparison

The image-processing approach extracts several visual features from the images and combines their similarity scores.

The current implementation uses weighted components including:

```text
Color Similarity       × 0.5
Hash Similarity        × 0.3
Contour Similarity     × 0.2
```

The resulting score is normalized to a 0–100 range.

This approach is intended as an experimental image-processing baseline rather than a trained machine-learning similarity model.

## Configuration

The AI-assisted cloud functions require a DashScope API key.

For security reasons, the API key is not included in this repository.

Configure the following environment variable in the Tencent CloudBase cloud function environment:

```text
DASHSCOPE_API_KEY=your_api_key
```

The cloud functions access the key through:

```javascript
process.env.DASHSCOPE_API_KEY
```

Never commit a real API key, password, access token, or other credentials to the repository.

When deploying the project in a new environment, users should configure their own CloudBase environment and API credentials.

## Running the Project

### Requirements

* WeChat Developer Tools
* Node.js
* A Tencent CloudBase environment
* A DashScope API key for AI-assisted analysis

### Basic Setup

1. Clone or download this repository.
2. Open the project root with WeChat Developer Tools.
3. Configure your own Tencent CloudBase environment.
4. Install dependencies for the required cloud functions.
5. Configure the `DASHSCOPE_API_KEY` environment variable in the relevant cloud functions.
6. Deploy the cloud functions to your CloudBase environment.
7. Configure the required CloudBase database collections and storage resources.
8. Run the Mini Program in WeChat Developer Tools.

Some configuration values in the project are specific to the original development environment and may need to be replaced when deploying the project in another CloudBase environment.

## Project Status

This project was developed as an undergraduate graduation project.

The repository contains the main implementation of the WeChat Mini Program, CloudBase backend functions, image-processing experiments, and multimodal AI integration.

The project is primarily intended for educational, research, and portfolio purposes. Some deployment configuration may require adaptation to a new Tencent CloudBase environment.

## Author

**Qianyu Ma**

B.Sc. in Computer Science
Donghua University

## License

This project is provided for educational and portfolio purposes.
