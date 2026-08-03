You are working inside the existing RuleScale Media codebase.

## Goal

Replace the existing placeholder projects/case studies with the real client projects.

The project images are located in the folder I have provided.

respective images with project name attached in "prompts\projects_images"
---

# Projects

Update the Projects/Case Studies section to include the following projects.

1. Mylini
Category:
E-commerce Website

2. Kodai Golden Honey
Category:
E-commerce Website

3. LightPic
Category:
AI SaaS Platform

Keep Fairyland Resort hidden for now (do not delete, just don't display it).

---

# Images

The project images are located inside the provided folder.

For every project:

1. Upload the image to Cloudinary.
2. Use the existing Cloudinary integration already configured in the project.
3. If Cloudinary upload is missing, implement it properly.
4. Copy the returned secure_url.
5. Store that URL inside Payload CMS as the project's thumbnail image.

Do NOT store local image paths.

The Payload entry should contain the Cloudinary URL.

---

# Payload CMS

Create/update the Project collection entries.

Populate every field.

Example:

Title

Slug

Short Description

Category

Services

Featured

Thumbnail (Cloudinary URL)

Case Study

SEO Tags

Sort Order

Status

Published At

Everything should be editable inside Payload Admin.

---

# Case Study Content

Use the following case studies exactly.

========================================================
PROJECT 1
========================================================

Title

Mylini

Subtitle

Building an SEO-Optimized E-commerce Experience for a Premium Kidswear Brand

Overview

Mylini needed more than a beautiful online store—they needed a website that could be discovered by search engines, load quickly across devices, and provide a seamless shopping experience for parents.

We designed and developed a modern e-commerce platform with SEO integrated into every layer, from technical optimization to structured product pages.

Challenge

• Limited organic visibility

• Need for a fast mobile shopping experience

• Hundreds of products requiring search-friendly architecture

• Premium branding with high performance

• Scalable e-commerce foundation

Solution

Website Development

• Responsive UI/UX

• Mobile-first architecture

• Optimized navigation

• Fast-loading product pages

• Modern shopping experience

Technical SEO

• Clean semantic HTML

• SEO-friendly URLs

• Meta titles & descriptions

• Structured heading hierarchy

• XML Sitemap

• Robots.txt

• Canonical URLs

• Schema Markup

• Optimized internal linking

Performance

• Optimized images

• Lazy loading

• Reduced JavaScript payload

• Core Web Vitals optimization

Outcome

A modern e-commerce platform built for both customers and search engines—combining premium design, fast performance, and an SEO-ready architecture that supports long-term organic growth.

Services

UI/UX

E-commerce

Technical SEO

Performance Optimization

Web Development

========================================================
PROJECT 2
========================================================

Title

Kodai Golden Honey

Subtitle

Building an SEO-Optimized E-commerce Platform for a Premium Honey Brand

Overview

Kodai Golden Honey wanted an online store that reflected the authenticity of its products while making it easy for customers to discover, explore, and purchase through organic search.

We designed and developed a modern SEO-first e-commerce platform focused on performance, trust, and search visibility.

Challenge

• Build trust for a premium natural product

• Improve organic discoverability

• Create a mobile-first shopping experience

• Organize multiple honey varieties with SEO-friendly structure

• Deliver a fast and secure buying experience

Solution

Website Development

• Responsive website design

• Mobile-first shopping experience

• Product-focused UI/UX

• Clean navigation

Technical SEO

• Semantic HTML

• SEO-friendly URLs

• Optimized metadata

• XML Sitemap

• Robots.txt

• Canonical URLs

• Schema Markup

Performance

• Optimized images

• Lazy loading

• Core Web Vitals

Outcome

A premium e-commerce platform that reflects the quality of the Kodai Golden Honey brand while providing a fast, SEO-ready shopping experience built to support sustainable organic growth.

Services

UI/UX

E-commerce

Technical SEO

Performance Optimization

Web Development

========================================================
PROJECT 3
========================================================

Title

LightPic

Subtitle

Designing an AI-Powered Event Photo Platform with Face Recognition

Overview

LightPic is an AI-powered event photo platform that helps photographers and event organizers deliver photos instantly using facial recognition.

We built a modern, performance-focused website that clearly communicates the product while delivering a smooth experience across desktop and mobile devices.

Challenge

• Present a complex AI product simply

• Build credibility

• Responsive design

• Optimize for SEO

• Improve conversions

Solution

Website Development

• Modern SaaS landing page

• Responsive UI

• Mobile-first design

• Conversion-focused layout

Technical SEO

• Semantic HTML

• SEO-friendly URLs

• Optimized metadata

• XML Sitemap

• Robots.txt

• Canonical URLs

• Schema

Performance

• Lazy loading

• Image optimization

• Core Web Vitals

Outcome

A high-performance SaaS website that clearly communicates LightPic's AI-powered solution while providing a fast, SEO-ready, and conversion-focused experience.

Services

UI/UX

SaaS Website

Technical SEO

Performance Optimization

Web Development

---

# Landing Page

Update the landing page Projects section so it fetches the projects dynamically from Payload instead of hardcoded constants.

Each card should display:

Project Thumbnail

Project Name

Category

Short Description

Hover animation

View Case Study button

---

# Individual Case Study Page

Create dynamic routes using the project slug.

Example

/work/mylini

/work/kodai-golden-honey

/work/lightpic

Each page should fetch data from Payload and render:

Hero

Overview

Challenge

Solution

Services

SEO Highlights

Outcome

CTA

Everything must come from Payload.

No hardcoded content.

---

# SEO

Generate metadata dynamically from Payload.

Include:

title

description

OpenGraph

Twitter

Canonical

Schema

---

# Validation

After completing:

1. Upload all project images to Cloudinary.
2. Confirm every Payload document contains the Cloudinary secure_url.
3. Remove all placeholder projects from the frontend.
4. Verify all images load from Cloudinary.
5. Verify every case study page works.
6. Ensure everything is editable through Payload Admin.

Do not leave any hardcoded project data in the frontend.