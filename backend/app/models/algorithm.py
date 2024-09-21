class Algorithm:
    def __init__(self, name, category):
        self.name = name
        self.category = category
        self.stop_flag = False

    def execute(self, input_data):
        raise NotImplementedError("Subclass must implement abstract method")

    def stop(self):
        self.stop_flag = True

class BubbleSort(Algorithm):
    def __init__(self):
        super().__init__("Bubble Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                if self.stop_flag:
                    return
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                yield {
                    'current_array': arr.copy(),
                    'comparisons': [j, j + 1],
                    'swapped': arr[j] > arr[j + 1]
                }

class QuickSort(Algorithm):
    def __init__(self):
        super().__init__("Quick Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        yield from self._quick_sort(arr, 0, len(arr) - 1)

    def _quick_sort(self, arr, low, high):
        if low < high and not self.stop_flag:
            partition_gen = self._partition(arr, low, high)
            for step in partition_gen:
                yield step
            pi = next(partition_gen)  # Get the actual partition index
            yield from self._quick_sort(arr, low, pi - 1)
            yield from self._quick_sort(arr, pi + 1, high)

    def _partition(self, arr, low, high):
        i = low - 1
        pivot = arr[high]
        for j in range(low, high):
            if self.stop_flag:
                return
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
            yield {
                'current_array': arr.copy(),
                'comparisons': [j, high],
                'swapped': i != j
            }
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        yield {
            'current_array': arr.copy(),
            'comparisons': [i + 1, high],
            'swapped': i + 1 != high
        }
        yield i + 1  # Yield the partition index as the last item

class MergeSort(Algorithm):
    def __init__(self):
        super().__init__("Merge Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        yield from self._merge_sort(arr, 0, len(arr) - 1)

    def _merge_sort(self, arr, left, right):
        if left < right and not self.stop_flag:
            mid = (left + right) // 2
            yield from self._merge_sort(arr, left, mid)
            yield from self._merge_sort(arr, mid + 1, right)
            yield from self._merge(arr, left, mid, right)

    def _merge(self, arr, left, mid, right):
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        i = j = 0
        k = left
        while i < len(left_arr) and j < len(right_arr) and not self.stop_flag:
            if left_arr[i] <= right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
            k += 1
            yield {
                'current_array': arr.copy(),
                'comparisons': [left + i, mid + 1 + j],
                'swapped': True
            }
        while i < len(left_arr) and not self.stop_flag:
            arr[k] = left_arr[i]
            i += 1
            k += 1
            yield {
                'current_array': arr.copy(),
                'comparisons': [k],
                'swapped': False
            }
        while j < len(right_arr) and not self.stop_flag:
            arr[k] = right_arr[j]
            j += 1
            k += 1
            yield {
                'current_array': arr.copy(),
                'comparisons': [k],
                'swapped': False
            }