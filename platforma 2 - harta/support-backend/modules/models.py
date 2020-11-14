from logging import NullHandler
from os import abort
import pickle


class Child:

    id: int = None
    name: str = None
    latitude: float = None
    longitude: float = None
    full_address: str = None
    phone_number: str = None
    lessons_count: int = None
    disconnects_per_lesson: int = None
    missed_lessons: int = None
    failures_count: int = None
    needs: list = []
    family_status: int = None
    abandonment_degree: int = None

    def __init__(self,
                 id: int,
                 latitude: str,
                 longitude: str,
                 name: str = None,
                 full_address: str = None,
                 phone_number: str = None,
                 lessons_count: int = None,
                 disconnects_per_lesson: str = None,
                 missed_lessons: int = None,
                 failures_count: int = None,
                 needs: str = None,
                 family_status: int = None,
                 abandonment_degree: int = None):
        self.id = id
        self.latitude = latitude
        self.longitude = longitude
        if name is not None:
            self.name = name
            self.full_address = full_address
            self.phone_number = phone_number
            self.lessons_count = lessons_count
            self.disconnects_per_lesson = disconnects_per_lesson
            self.missed_lessons = missed_lessons
            self.failures_count = failures_count
            self.needs = self._unserialize_needs(needs)
            self.family_status = family_status
            self.abandonment_degree = abandonment_degree

    def _unserialize_needs(self, needs: str) -> str:
        unserialized = ""
        is_first = 1
        for need in needs.split(","):
            need_id = int(need)
            if is_first:
                is_first = 0
            else:
                unserialized += ", "
            if need_id == 0:
                unserialized += "calculator"
            elif need_id == 1:
                unserialized += "tabletă"
            elif need_id == 2:
                unserialized += "rechizite"
        return unserialized

    def _unserialize_family_status(self, status: str) -> str:
        status_id = int(status)
        if status_id == 0:
            return "ambii părinți angajați"
        elif status_id == 1:
            return "un părinte angajat, altul șomer"

    def update_degree(self) -> bool:
        with open("ml_models/abandonment_degree_svm.pickle",
                  "rb") as serialized_model:
            model = pickle.loads(serialized_model.read())
            prediction = round(
                model.predict([[
                    self.lessons_count, self.disconnects_per_lesson,
                    self.missed_lessons, self.failures_count,
                    len(self.needs), self.family_status
                ]])[0], 3)
            if self.abandonment_degree != prediction:
                if prediction > 1:
                    self.abandonment_degree = 100
                else:
                    self.abandonment_degree = prediction * 100
                return True
            return False

    def to_dict(self, all_data: bool = False) -> dict:
        if not all_data:
            return {
                "id": self.id,
                "latitude": self.latitude,
                "longitude": self.longitude
            }
        else:
            return {
                "id":
                self.id,
                "name":
                self.name,
                "latitude":
                self.latitude,
                "longitude":
                self.longitude,
                "full_address":
                self.full_address,
                "phone_number":
                self.phone_number,
                "lessons_count":
                self.lessons_count,
                "disconnects_per_lesson":
                self.disconnects_per_lesson,
                "missed_lessons":
                self.missed_lessons,
                "failures_count":
                self.failures_count,
                "needs":
                self.needs,
                "family_status":
                self._unserialize_family_status(self.family_status),
                "abandonment_degree":
                self.abandonment_degree,
            }