from fastapi import APIRouter

router = APIRouter(prefix='/items')

db = []

@router.post("/")
def create_item(name: str):
    db.append({"item_id" : len(db) + 1, "name": name})     
    return db[-1]   

@router.get("/")
def read_items():
    return db

@router.get("/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return db[item_id - 1]

@router.put("/{item_id}")
def update_item(item_id: int, name: str):
    db[item_id - 1 ]["name"] = name
    return db[item_id - 1]

@router.delete("/{item_id}")
def delete_item(item_id: int):
    del db[item_id - 1]
