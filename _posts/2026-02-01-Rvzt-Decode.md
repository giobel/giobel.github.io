---
layout: post
title: Rvzt Decode-Encode
---

### 1. Export .vimsst file

### 2. Decode/Encode the file

```python
import blackboxprotobuf

path = r'Demo.vimsst'

with open(path2, "rb") as f:
    data = f.read()
    print (data)
    decdata, typeof = blackboxprotobuf.decode_message(data)
    encItem = blackboxprotobuf.encode_message(decdata, typeof)
    print (encItem)

filename = 'output.vimsst'
with open(filename, "wb") as f:
    f.write(encItem)
    print ("Done")
```

### 3. Edit the file
