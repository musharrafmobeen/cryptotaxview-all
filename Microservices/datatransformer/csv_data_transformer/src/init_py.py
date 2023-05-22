import os
import psycopg2


def getMappingData(exchange: str):
    conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USERNAME'],
            password=os.environ['DB_PASSWORD'])

    # Open a cursor to perform database operations
    cur = conn.cursor()
    cur.execute("SELECT * FROM exchange_master_table WHERE name = '{}';".format(exchange))
    record = cur.fetchall()
    exchange = record[0][1]
    rowToCol = record[0][2]
    csvSplitIdentifier = record[0][3]
    csvColumnMapping = record[0][4]
    csvColumnJoinMapping = record[0][5]
    csvFormulas = record[0][6]
    conn.commit()
    cur.close()
    conn.close()
    return {
        "rowToCol":rowToCol,
        "csvSplitIdentifier":csvSplitIdentifier,
        "csvColumnMapping":csvColumnMapping,
        "csvColumnJoinMapping":csvColumnJoinMapping,
        "exchange": exchange,
        "csvFormulas": csvFormulas
    }
    

