import csv
import os
from typing import List, Dict

def load_csv(filepath: str) -> List[Dict[str, str]]:
    if not os.path.exists(filepath):
        return []
    
    with open(filepath, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        return [row for row in reader]

def write_csv(filepath: str, fieldnames: List[str], data: List[Dict[str, str]]):
    with open(filepath, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(data)
