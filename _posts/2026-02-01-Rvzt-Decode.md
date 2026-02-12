---
layout: post
title: Rvzt Decode-Encode
---

The most efficient way to create appearance templates is to use search sets. Search sets can be added to apperance templates using their id and their name. Therefore before generating appearance templates we need to collect all the search sets that we will be using. 

Let's look at the content of one search set with only two conditions and an OR operator:

<img width="1099" height="572" alt="image" src="https://github.com/user-attachments/assets/072a0207-41ca-4d33-88be-01cb46aaac08" />

### 1. Export the Search Set to .vimsst file

If we print the file:

```python
path = r'Demo.vimsst'
with open(path2 "rb") as f:
    data = f.read()
    print (data)
```

The content looks like this:

```
b'\n\x10MarkerSearchSets\x10\x01\x18\x00"\xce\x02\n$0cca6a0f-ca95-4dd6-bd50-a71e109587ae\x10\x80\xe1\xbf\xb8\xb7\xb9\x9a\xef\x08\x18\x80\xe1\xbf\xb8\xb7\xb9\x9a\xef\x08"$07408a06-3eae-47dc-aaed-39aa1fc2f6b2(\x000\x01:#Actual Start or End Date_2026-02-01B\xc2\x01\x08\x00\x12]\x08\x00\x12Y\x12W\x08\n\x12\x19\n\nTimeLiner+\x12\x0bTimeLiner +\x1a&\n\x11Actual Start Date\x12\x11Actual Start Date"\x0e\x08\x06\x18\x80\xde\xac\x98\xa2\x9c\x98\xef\x08(\x00(\x06\x12\x02\x08\x03\x12Y\x08\x00\x12U\x12S\x08\n\x12\x19\n\nTimeLiner+\x12\x0bTimeLiner +\x1a"\n\x0fActual End Date\x12\x0fActual End Date"\x0e\x08\x06\x18\x80\xde\xac\x98\xa2\x9c\x98\xef\x08(\x00(\x06\x18\x00'
```

Which is a a binary data serialization using the Protocol Buffers (protobuf) format created by Google.

### 2. Decode the file using the python Blackbox protobuf library

```python
import blackboxprotobuf

path = r'Demo.vimsst'

with open(path2, "rb") as f:
    data = f.read()
    decdata, typeof = blackboxprotobuf.decode_message(data)
```

The decoded output is more readable:

```python
{'1': b'MarkerSearchSets', '2': 1, '3': 0, '4': {'1': b'0cca6a0f-ca95-4dd6-bd50-a71e109587ae', '2': 639064519730000000, '3': 639064519730000000, '4': b'07408a06-3eae-47dc-aaed-39aa1fc2f6b2', '5': 0, '6': 1, '7': b'Actual Start or End Date_2026-02-01', '8': {'1': 0, '2': [{'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual Start Date', '2': b'Actual Start Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}, {'1': 3}, {'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual End Date', '2': b'Actual End Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}], '3': 0}}}
```
We can extract the search set id and name:

```python
print (f"id: {decdata['4']['1']}, name: {decdata['4']['7'].decode('utf-8')}")
```

and all the conditions:



### 3. Edit the file



### 4. Save the edited file

```python
filename = 'output.vimsst'
with open(filename, "wb") as f:
    f.write(encItem)
    print ("File saved")
```

Now let's export a folder containing two search sets:

<img width="1098" height="571" alt="image" src="https://github.com/user-attachments/assets/c5453514-0a1f-4204-843a-5b4bdc4cff33" />

