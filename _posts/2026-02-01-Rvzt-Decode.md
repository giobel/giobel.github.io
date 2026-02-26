---
layout: post
title: Rvzt Decode-Encode
---

## Summary

### 1.Search Sets

- [1.1 Get Search Sets](#11-get-search-sets)
- [1.2 Create Search Sets with xml](#12-create-search-sets-with-xml)
- [1.3 Create Search Sets with .vimsst](#13-create-search-sets-with-vimsst)

### 2.Appearance Templates

- [2.1 Create Appearance Template from items property](#beam-end-points)
- [2.2 Create Appearance Template from Search Sets](#beam-end-points) 

### 3.Rvzt API

- [3.1 Get Tokens]()
- [3.2 Refresh Tokens]()
- [3.3 Get Licence]()
- [3.4 Get Projects]()
- [3.5 Get Sheets]()
- [3.6 Get Workflows]()
- [3.7 Add Stamps]()

---

## 1. Search Sets

### 1.1 Get Search Sets

<details>

<summary>Expand</summary>

Exported Search Sets are saved in a .vimsst file format.

Let's start by looking at the content of one search set with only two conditions and an OR operator:

<img alt="image" src="https://github.com/user-attachments/assets/072a0207-41ca-4d33-88be-01cb46aaac08" />

**1.1.A Export the Search Set to .vimsst file**

If we print the .vimsst file:

```python
path = r'Demo.vimsst'
with open(path2 "rb") as f:
    data = f.read()
    print (data)
```

<details>
<summary>The content looks like this:</summary>
b'\n\x10MarkerSearchSets\x10\x01\x18\x00"\xce\x02\n$0cca6a0f-ca95-4dd6-bd50-a71e109587ae\x10\x80\xe1\xbf\xb8\xb7\xb9\x9a\xef\x08\x18\x80\xe1\xbf\xb8\xb7\xb9\x9a\xef\x08"$07408a06-3eae-47dc-aaed-39aa1fc2f6b2(\x000\x01:#Actual Start or End Date_2026-02-01B\xc2\x01\x08\x00\x12]\x08\x00\x12Y\x12W\x08\n\x12\x19\n\nTimeLiner+\x12\x0bTimeLiner +\x1a&\n\x11Actual Start Date\x12\x11Actual Start Date"\x0e\x08\x06\x18\x80\xde\xac\x98\xa2\x9c\x98\xef\x08(\x00(\x06\x12\x02\x08\x03\x12Y\x08\x00\x12U\x12S\x08\n\x12\x19\n\nTimeLiner+\x12\x0bTimeLiner +\x1a"\n\x0fActual End Date\x12\x0fActual End Date"\x0e\x08\x06\x18\x80\xde\xac\x98\xa2\x9c\x98\xef\x08(\x00(\x06\x18\x00'
</details>

Which is a a binary data serialization using the Protocol Buffers (protobuf) format created by Google.

**1.1.B Decode the file using the python Blackbox protobuf library**

The file can be decoded using the blackboxprotobuf library:

```python
import blackboxprotobuf

path = r'Demo.vimsst'

with open(path2, "rb") as f:
    data = f.read()
    decdata, typeof = blackboxprotobuf.decode_message(data)
```

<details>
<summary>Which makes it more readable:</summary>
{'1': b'MarkerSearchSets', '2': 1, '3': 0, '4': {'1': b'0cca6a0f-ca95-4dd6-bd50-a71e109587ae', '2': 639064519730000000, '3': 639064519730000000, '4': b'07408a06-3eae-47dc-aaed-39aa1fc2f6b2', '5': 0, '6': 1, '7': b'Actual Start or End Date_2026-02-01', '8': {'1': 0, '2': [{'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual Start Date', '2': b'Actual Start Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}, {'1': 3}, {'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual End Date', '2': b'Actual End Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}], '3': 0}}}
</details>

This is a python dictionary and we can extract the search set id and name by using their keys:

By looking at the output we can see that Search Set Id and Name are stored at keys ['4']['1'] and ['4']['7']

```python
print (f"id: {decdata['4']['1']}, name: {decdata['4']['7'].decode('utf-8')}")
OUTPUT: id: b'0cca6a0f-ca95-4dd6-bd50-a71e109587ae', name: Actual Start or End Date_2026-02-01
```

Conditions are stored in a list at key ['4']['8']['2']:

```python
for c in decdata['4']['8']['2']:
    print (f"{c}")
```

<details>
<summary>Output:</summary>
[
    {'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual Start Date', '2': b'Actual Start Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}},
    {'1': 3},
    {'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual End Date', '2': b'Actual End Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}
]
</details>

Index 0 → Condition for Actual Start Date

Index 1 → {'1': 3} → Logical operator OR

Index 2 → Condition for Actual End Date

If we change the Logical operator to AND, Index 1 will become:

```python
  {'1': 4}
```

The date is stored in nanoseconds starting from 01-01-0001 (.NET DateTime counts the number of ticks since midnight, January 1, 0001).

We can use a function to convert the date to a readable format:

```python
def from_revizto_time(revizto_time: int) -> datetime:
    
    nanoseconds = 1_000_000_000

    #revizto timestamp (time at 31-12-2023 23:00)
    reviztoStartTime = 638396604*nanoseconds

    #revizto start date in project timezone (+8 hours)
    reviztoStartDate = datetime.strptime("20240101 07:00", "%Y%m%d %H:%M")

    # Compute the difference in seconds
    seconds_delta = (revizto_time - reviztoStartTime) * 100 / nanoseconds
    
    # Add to the base datetime
    return reviztoStartDate + timedelta(seconds=seconds_delta)
```

If we use this condition as input:

{'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual Start Date', '2': b'Actual Start Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}

The date will be:

```python
time = c['2']['2']['4']['3']
print (f"date: {from_revizto_time(time).strftime('%Y-%m-%d %H:%M')}")

OUTPUT: date: 2026-02-01 00:02
```

**1.1.C Search Sets inside a folder**

Now let's export a folder containing two search sets:

<img alt="image" src="https://github.com/user-attachments/assets/358c477e-b97b-4f81-9a33-281218860f8e" />


Our code does not work anymore because the data structure has changed:

```python
print (f"id: {decdata['4']['1']}, name: {decdata['4']['7'].decode('utf-8')}")
                  ~~~~~~~~~~~~^^^^^
TypeError: list indices must be integers or slices, not str
```
<details>
<summary>Key '4' in the decoded data is now a list of objects:</summary>
{'1': b'MarkerSearchSets', '2': 1, '3': 0, '4': [{'1': b'c536c502-4483-4218-bec4-ba706ad3fb71', '2': 639075091320000000, '3': 639075091320000000, '5': 0, '6': 2, '7': b'Test'}, {'1': b'81160f0d-1160-4928-8567-97312b71db46', '2': 639064519730000000, '3': 639075091360000000, '4': b'c536c502-4483-4218-bec4-ba706ad3fb71', '5': 0, '6': 1, '7': b'Actual Start or End Date_2026-02-01', '8': {'1': 0, '2': [{'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual Start Date', '2': b'Actual Start Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}, {'1': 4}, {'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual End Date', '2': b'Actual End Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}], '3': 0}}, {'1': b'774f3d34-9e56-4f23-bbc8-ed998a997574', '2': 639057743530000000, '3': 639075091380000000, '4': b'c536c502-4483-4218-bec4-ba706ad3fb71', '5': 0, '6': 1, '7': b'Ex Bridge Demo Hidden', '8': {'1': 0, '2': [{'1': 1}, {'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'EXISTING BRIDGE'}, '5': 6}}}, {'1': 4}, {'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'STAGE 5 - Existing Abutment Demo Pile Sheet Removal$T-Roffs'}, '5': 6}}}, {'1': 3}, {'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'STAGE 5 - Existing Abutment Demo Pile Sheet Removal$T-Roffs'}, '5': 6}}}, {'1': 2}, {'1': 3}, {'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'STAGE 6 - Excavation Skirt Wall$Link Slab'}, '5': 6}}}], '3': 1}}]}
</details>

To extract the searchsets information we need to iterate through this list. We can create a function to process both individual searchsets and searchsets inside a folder:

```python
def searchsetIterator(_decdata):
    if isinstance(_decdata.get('4'), list):
        print("searchsets are inside a folder")
        for sset in _decdata['4']:
            if '8' not in sset:
                print (f"id: {sset['1']}, folder name: {sset['7'].decode('utf-8')}")
            else:
                #print (sset)
                print (f"id: {sset['1']}, Search Set name: {sset['7'].decode('utf-8')}")
                print ("conditions")
                print (f"id: {sset['1']}, name: {sset['7'].decode('utf-8')}")
                for c in sset['8']['2']:
                    print (c)
    else:
        print("only one Search Set found")
        #Search Set id and name
        print (f"id: {_decdata['4']['1']}, name: {_decdata['4']['7'].decode('utf-8')}")
        print ("conditions")
        for c in _decdata['4']['8']['2']:
            print (c)
```

<details>
<summary>If we place the previous Search Set inside a folder named "Test", the output will be:</summary>

searchsets are inside a folder

id: b'c536c502-4483-4218-bec4-ba706ad3fb71', folder name: Test

id: b'81160f0d-1160-4928-8567-97312b71db46', Search Set name: Actual Start or End Date_2026-02-01

conditions

id: b'81160f0d-1160-4928-8567-97312b71db46', name: Actual Start or End Date_2026-02-01

{'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual Start Date', '2': b'Actual Start Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}

{'1': 4}

{'1': 0, '2': {'2': {'1': 10, '2': {'1': b'TimeLiner+', '2': b'TimeLiner +'}, '3': {'1': b'Actual End Date', '2': b'Actual End Date'}, '4': {'1': 6, '3': 639054721500000000, '5': 0}, '5': 6}}}
</details>

#### 1.1.C Search Set with grouped conditions

If our search set contains grouped conditions:

<img alt="image" src="https://github.com/user-attachments/assets/a92294ec-383d-4436-a6eb-6bcf4326751c" />

<details>
<summary>the output will be:</summary>

```text
id: b'774f3d34-9e56-4f23-bbc8-ed998a997574', Search Set name: Ex Bridge Demo Hidden

conditions

id: b'774f3d34-9e56-4f23-bbc8-ed998a997574', name: Ex Bridge Demo Hidden
    
{'1': 1}

{'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'EXISTING BRIDGE'}, '5': 6}}}
{'1': 4}

{'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'STAGE 5 - Existing Abutment Demo Pile Sheet Removal$T-Roffs'}, '5': 6}}}

{'1': 3}

{'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'STAGE 5 - Existing Abutment Demo Pile Sheet Removal$T-Roffs'}, '5': 6}}}

{'1': 2}

{'1': 3}

{'1': 0, '2': {'2': {'1': 0, '2': {'1': b'LcOaNode', '2': b'Item'}, '3': {'1': b'LcOaNodeLayer', '2': b'Layer'}, '4': {'1': 5, '2': b'STAGE 6 - Excavation Skirt Wall$Link Slab'}, '5': 6}}}
```
</details>

{'1': 1} defines the conditions inside the group
{'1': 2} defines the condition outside the group
{'1': 3} and {'1': 4} defines the OR and AND operators
</details>

### 1.2 Create Search Sets with xml

<details>

<summary>Expand</summary>

</details>


### 1.3 Create Search Sets with vimsst



<details>

<summary>Expand</summary>

</details>


### 4. Create Appearance Templates

The most efficient way to create appearance templates is to use search sets. Search sets can be added to apperance templates using their id and their name. Therefore before generating appearance templates we need to collect all the search sets that we will be using. 

We can create 



### 5. Save the edited file

```python
filename = 'output.vimsst'
with open(filename, "wb") as f:
    f.write(encItem)
    print ("File saved")
```
