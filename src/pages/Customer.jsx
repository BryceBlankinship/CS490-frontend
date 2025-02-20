import { Button, Flex, Modal, Select, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react"

export default function Customer() {
    const [allCustomers, setAllCustomers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchType, setSearchType] = useState('firstName');
    const [paginationStart, setPaginationStart] = useState(0);
    const [paginationEnd, setPaginationEnd] = useState(10);
    const [opened, setOpened] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});

    useEffect(() => {
        (async function run() {
          const res = await fetch("http://localhost:8080/customers");
          if (res.ok) {
            const data = await res.json();
            setAllCustomers(data);
            setCustomers(data);
          }
        })();
      }, []);

    const handlePrev = () => {
        setPaginationStart((prev) => prev - 10);
        setPaginationEnd((prev) => prev - 10);
    }

    const handleNext = () => {
        setPaginationStart((prev) => prev + 10);
        setPaginationEnd((prev) => prev + 10);
    }

    const openCustomer = (id) => {
        setOpened(true);
        setSelectedCustomer(...customers.filter((customer) => customer.id == id));
    }

    useEffect(() => {
        if (searchValue.length !== 0) {
          const lowerSearchValue = searchValue.toLowerCase();
          const filtered = allCustomers.filter((customer) => {
            if (searchType === "firstName") {
              return customer.firstName.toLowerCase().includes(lowerSearchValue);
            } else if (searchType === "lastName") {
              return customer.lastName.toLowerCase().includes(lowerSearchValue);
            } else if (searchType === "id") {
              return customer.id.toString().includes(lowerSearchValue);
            }
            return false;
          });
          setCustomers(filtered);
        } else {
          // reset to full list if search value is empty
          setCustomers(allCustomers);
        }
      }, [searchValue, searchType, allCustomers]);

    const handleEdit = async (id) => {
        const res = await fetch('http://localhost:8080/customer?id=' + id, {
            method: 'PATCH',
            body: JSON.stringify({

            })
        })
    }

    const handleDelete = async (id) => {
        const res = await fetch('http://localhost:8080/customer?id=' + id, {
            method: 'DELETE'
        })

        if(res.ok){
            window.location.reload();
        }
    }

    return (
        <div className="customer-container">
            <Modal title='Customer Details' opened={opened} onClose={() => setOpened(false)}>
                <p>Customer ID: {selectedCustomer.id}</p>
                <p>Store ID: {selectedCustomer.storeId}</p>
                <p>Name: {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                <p>Email: {selectedCustomer.email}</p>
                <p>Phone: {selectedCustomer.phone}</p>
                <p>Address: {selectedCustomer.address}, {selectedCustomer.district}, {selectedCustomer.city}, {selectedCustomer.country}, {selectedCustomer.postalCode}</p>
                <p>Active Status: {selectedCustomer.active ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>Inactive</span>}</p>
                <p>Customer since: {new Date(selectedCustomer.createDate).toLocaleDateString()}</p>
                <p>Last updated: {new Date(selectedCustomer.lastUpdate).toLocaleDateString()}</p>
            </Modal>

            <h2>All customers</h2>
            <Flex direction={'row'} align={'center'} gap={10}>
                <TextInput placeholder={'Enter customer'} w={250} label="Search customer" value={searchValue} onChange={e => setSearchValue(e.currentTarget.value)} />
                <Select label="By type" data={[{ label: 'ID', value: 'id' }, { label: 'First Name', value: 'firstName' }, { label: 'Last Name', value: 'lastName' }]} value={searchType} onChange={setSearchType} />
            </Flex>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>First name</Table.Th>
                        <Table.Th>Last name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Phone</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {customers.slice(paginationStart, paginationEnd).map((customer) => (
                        <Table.Tr key={customer.id}>
                            <Table.Td>{customer.firstName}</Table.Td>
                            <Table.Td>{customer.lastName}</Table.Td>
                            <Table.Td>{customer.email}</Table.Td>
                            <Table.Td>{customer.phone}</Table.Td>
                            <Table.Td><Button variant='outline' onClick={() => openCustomer(customer.id)}>View Details</Button></Table.Td>
                            <Table.Td><Button color="red" variant='subtle' onClick={() => handleDelete(customer.id)}>Delete Customer</Button></Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <Flex direction={'column'} align={'center'} mt={20}>
                <Flex direction={'row'} align={'center'} justify={'center'} w={'100%'} gap={10}>
                    <Button disabled={paginationStart == 0} variant="outline" onClick={handlePrev}>Prev</Button>
                    <Button onClick={handleNext}>Next</Button>
                </Flex>
                <p>Showing {paginationStart}-{paginationEnd} of {customers.length} customers</p>
            </Flex>
        </div>
    )
}
