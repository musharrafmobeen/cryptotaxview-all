FROM python:3.8.10

# Setting Home Directory for containers
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

EXPOSE 7015
CMD [ "python", "./csv_data_transformer/src/app.py" ]
