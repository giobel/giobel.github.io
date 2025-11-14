---
layout: post
title: Blender Mesh Fill Hole
---

### Import the scan in [MeshLab](https://www.meshlab.net/#download)
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/46997bb8-0f47-47d7-9788-916d79a38fdb" />

### Create a mesh using Filters -> Remeshing, Simplification and Reconstruction -> Screened Poisson Surface Reconstruction. Export the mesh as .ply
<img width="2880"  alt="image" src="https://github.com/user-attachments/assets/9ca62b1c-3953-40da-8200-1e71f1d52426" />

### Import in Blender and scale/rotate to fit
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/ae5026ca-44e7-479e-ad5b-618b5f670521" />

### Go in Edit Mode (Tab), Select Face Mode and Select by Circle (C) faces around the opening to fill. Increase/Decrease the circle size with middle mouse button. Press Esc to pause the selection and to navigate the model.
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/f4456fef-0e41-4963-9961-8bd13bebb013" />

### Press Shift+D to duplicate the mesh faces and Esc to position in place. Press P -> Selection to separate the selected faces from the main object
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/55ea5137-caff-446d-8373-a83ea4983ec0" />

### In Edit mode, Select Edges Mode, press Alt+Left Mouse Button twice on an edge to select all connected edges. Then press P and Selection to separate the loop
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/f0808d45-5975-4209-b3e1-4bb1d1f44b85" />

### Select all Vertexes, then from the Vertexes menu select smooth
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/0248df12-9b94-4211-a998-28d4ad9179b6" />

### Select the edges and press F (Fill)
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/27cb0b04-58c1-45a8-b671-bbe702465b5f" />

### Result
<img width="2880" alt="image" src="https://github.com/user-attachments/assets/0c0bef2f-54ee-4108-b715-dd7e55e3a855" />
