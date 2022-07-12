import datetime


def date_encoder():
    return lambda dt: datetime.datetime(
        year=dt.year, month=dt.month, day=dt.day, hour=0, minute=0, second=0
    )