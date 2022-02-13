FROM python:3.10

RUN mkdir -p ~/.cillum/exp_cover

WORKDIR ~/.cillum/exp_cover

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY *.py ./
COPY *.png ./
COPY *.otf ./

CMD [ "python", "main.py"]
