from app.models.algorithm import BubbleSort, QuickSort, MergeSort, InsertionSort, SelectionSort, HeapSort, ShellSort, CountingSort, RadixSort

class AlgorithmService:
    _algorithms = {
        "Bubble Sort": BubbleSort(),
        "Quick Sort": QuickSort(),
        "Merge Sort": MergeSort(),
        "Insertion Sort": InsertionSort(),
        "Selection Sort": SelectionSort(),
        "Heap Sort": HeapSort(),
        "Shell Sort": ShellSort(),
        "Counting Sort": CountingSort(),
        "Radix Sort": RadixSort()
    }
    _current_algorithm = None

    @classmethod
    def get_algorithms(cls):
        return [{"id": i + 1, "name": name, "category": algo.category} for i, (name, algo) in enumerate(cls._algorithms.items())]

    @classmethod
    def execute_algorithm(cls, algorithm_name, input_data):
        if algorithm_name not in cls._algorithms:
            raise ValueError(f"Unknown algorithm: {algorithm_name}")
        
        cls._current_algorithm = cls._algorithms[algorithm_name]
        cls._current_algorithm.stop_flag = False
        
        for step in cls._current_algorithm.execute(input_data):
            if cls._current_algorithm.stop_flag:
                yield None
                break
            yield step

    @classmethod
    def stop_algorithm(cls):
        if cls._current_algorithm:
            cls._current_algorithm.stop()