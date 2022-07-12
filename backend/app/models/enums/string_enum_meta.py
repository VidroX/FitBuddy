from enum import EnumMeta


class StringEnumMeta(EnumMeta):
    def __contains__(cls, item):
        try:
            cls(item)
        except ValueError:
            return False
        
        return True   