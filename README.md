# JSDataChecker
JavaScript Library to read dataset content (e.g., Open Data), infer data types, give a data quality indicator and parse content.

In details, it analysis the json (specified paths) to infer the data type. In addition, when request (via code) the library converts the json data based on the inferred type.

Recognised basic types:
 - Text;
 - Number;
 - Date;
 - Object;
 - Null.

Recognised types:
 - Geographic coordinates;
 - JSON;
 - GEOJSON.

It also provides a module to be used in nodejs.

## Documentation

See wiki pages [here](https://github.com/donpir/JSDataChecker/wiki).

## License 

The library has released with the LGPL license [link here](http://www.gnu.org/licenses/lgpl.html).

Briefly with this license:
 
 - Freedom to modify and distribute modified copies of DataChecker, distributing the source code and releasing it with the same LGPL license;
 - You can dynamically (not statically) link DataChecker library in a proprietary software, keeping the JS files as they are.
  
## Publications

Please, refer to this paper for details on the library and its use case:

- _D. Pirozzi, V. Scarano_, **_Support citizens in Visualizing Open Data_**, 20th International Conference on Information Visualisation, Lisbon (Portugal), 19-22 July 2016 ([Citation](http://ieeexplore.ieee.org/abstract/document/7557938/)) 

 
