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
            partition_index = None
            for step in self._partition(arr, low, high):
                if isinstance(step, int):
                    partition_index = step
                else:
                    yield step
            if partition_index is not None:
                yield from self._quick_sort(arr, low, partition_index - 1)
                yield from self._quick_sort(arr, partition_index + 1, high)

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
        
class InsertionSort(Algorithm):
    def __init__(self):
        super().__init__("Insertion Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                if self.stop_flag:
                    return
                arr[j + 1] = arr[j]
                j -= 1
                yield {
                    'current_array': arr.copy(),
                    'comparisons': [j, j + 1],
                    'swapped': True
                }
            arr[j + 1] = key
            yield {
                'current_array': arr.copy(),
                'comparisons': [i, j + 1],
                'swapped': i != j + 1
            }
            
class SelectionSort(Algorithm):
    def __init__(self):
        super().__init__("Selection Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        for i in range(len(arr)):
            min_idx = i
            for j in range(i + 1, len(arr)):
                if self.stop_flag:
                    return
                if arr[j] < arr[min_idx]:
                    min_idx = j
                yield {
                    'current_array': arr.copy(),
                    'comparisons': [j, min_idx],
                    'swapped': False
                }
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            yield {
                'current_array': arr.copy(),
                'comparisons': [i, min_idx],
                'swapped': i != min_idx
            }
            
class HeapSort(Algorithm):
    def __init__(self):
        super().__init__("Heap Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        n = len(arr)

        for i in range(n // 2 - 1, -1, -1):
            yield from self._heapify(arr, n, i)

        for i in range(n - 1, 0, -1):
            if self.stop_flag:
                return
            arr[i], arr[0] = arr[0], arr[i]
            yield {
                'current_array': arr.copy(),
                'comparisons': [i, 0],
                'swapped': True
            }
            yield from self._heapify(arr, i, 0)

    def _heapify(self, arr, n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < n and arr[left] > arr[largest]:
            largest = left

        if right < n and arr[right] > arr[largest]:
            largest = right

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            yield {
                'current_array': arr.copy(),
                'comparisons': [i, largest],
                'swapped': True
            }
            yield from self._heapify(arr, n, largest)

class ShellSort(Algorithm):
    def __init__(self):
        super().__init__("Shell Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        n = len(arr)
        gap = n // 2

        while gap > 0:
            for i in range(gap, n):
                temp = arr[i]
                j = i
                while j >= gap and arr[j - gap] > temp:
                    if self.stop_flag:
                        return
                    arr[j] = arr[j - gap]
                    j -= gap
                    yield {
                        'current_array': arr.copy(),
                        'comparisons': [j, j + gap],
                        'swapped': True
                    }
                arr[j] = temp
                yield {
                    'current_array': arr.copy(),
                    'comparisons': [i, j],
                    'swapped': i != j
                }
            gap //= 2            

class CountingSort(Algorithm):
    def __init__(self):
        super().__init__("Counting Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        max_val = max(arr)
        min_val = min(arr)
        range_val = max_val - min_val + 1

        count = [0] * range_val
        output = [0] * len(arr)

        for i in range(len(arr)):
            if self.stop_flag:
                return
            count[arr[i] - min_val] += 1
            yield {
                'current_array': arr.copy(),
                'comparisons': [i],
                'swapped': False
            }

        for i in range(1, len(count)):
            count[i] += count[i - 1]

        i = len(arr) - 1
        while i >= 0:
            if self.stop_flag:
                return
            output[count[arr[i] - min_val] - 1] = arr[i]
            count[arr[i] - min_val] -= 1
            i -= 1
            yield {
                'current_array': output.copy(),
                'comparisons': [i],
                'swapped': True
            }

        for i in range(len(arr)):
            arr[i] = output[i]
            yield {
                'current_array': arr.copy(),
                'comparisons': [i],
                'swapped': arr[i] != input_data[i]
            }
class RadixSort(Algorithm):
    def __init__(self):
        super().__init__("Radix Sort", "Sorting")

    def execute(self, input_data):
        arr = input_data.copy()
        max_num = max(arr)
        exp = 1
        while max_num // exp > 0:
            yield from self._counting_sort(arr, exp)
            exp *= 10

    def _counting_sort(self, arr, exp):
        n = len(arr)
        output = [0] * n
        count = [0] * 10

        for i in range(n):
            if self.stop_flag:
                return
            index = arr[i] // exp
            count[index % 10] += 1
            yield {
                'current_array': arr.copy(),
                'comparisons': [i],
                'swapped': False
            }

        for i in range(1, 10):
            count[i] += count[i - 1]

        i = n - 1
        while i >= 0:
            if self.stop_flag:
                return
            index = arr[i] // exp
            output[count[index % 10] - 1] = arr[i]
            count[index % 10] -= 1
            i -= 1
            yield {
                'current_array': output.copy(),
                'comparisons': [i],
                'swapped': True
            }

        for i in range(len(arr)):
            arr[i] = output[i]
            yield {
                'current_array': arr.copy(),
                'comparisons': [i],
                'swapped': arr[i] != output[i]
            }