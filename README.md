# expand-envvars

`expand-envvars` recursively walks a configuration object and expands any
`${VARIABLE}`s it finds in strings. Objects are modified in-place and only
object's own enumerable properties are considered. Simple arrays are also
supported.

The library can be useful e.g when running servers with a complex configuration
inside Docker containers when one needs only a part of the configuration file –
such as database parameters – to be easily configurable for each container.

Undefined variables are replaced with an empty string.

## Example

Assuming environment variables

    DB_HOST=localhost
    DB_PORT=3306
    DB_NAME=testdb
    DB_USER=root

the following code

    const expand = require('expand-envvars')
    const config = expand({
      database: {
        client: mysql
        connection: {
          host: ${DB_HOST}
          port: ${DB_PORT}
          user: ${DB_USER}
          password: ${DB_PASSWORD}
          database: ${DB_NAME}
        }
      }
    }, {
      substitute: {
        'DB_PORT': value => parseInt(value)
      }
    })

will result in the following `config`:

    {
      database: {
        client: mysql
        connection: {
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: '',
          database: testdb
        }
      }
    }

Here a custom substitution function was specified for `DB_PORT` in order to
convert it to an integer.

## Usage

Expansion is called as `expand(what, options)`, where first parameter is the
object to be considered and `options` is an optional object customising the
expansion.

Currently the only option property is `substitute`, which can be either a
function or an object.

If `substitute` is given as a function, it will be
called as `substitute(variable, value)` for each environment variable and its
value before the replacement is made. The actual value replaced will then be
the return value of `substitute`.

If `substitute` is given as an object, for each environment `variable` a key
with the same name is checked and if found to be a function, called as
`substitute[variable](value)` and return value used as replacement as above.
