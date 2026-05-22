.PHONY: install test verify clean

install:
	.venv/bin/pip install -e .[dev]

test:
	.venv/bin/pytest tests/

verify:
	.venv/bin/python3 /home/ayush/.gemini/antigravity/brain/914deb11-e2d3-4632-813c-933c86f78926/scratch/verify_notebooks.py

clean:
	rm -rf build/ dist/ *.egg-info/ .pytest_cache/
	find . -type d -name "__pycache__" -exec rm -rf {} +
